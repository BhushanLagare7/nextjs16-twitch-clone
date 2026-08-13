/**
 * @file ingress.ts
 * @module actions/ingress
 * @description
 * Server-side actions for managing LiveKit Ingress and Room resources.
 * Provides functionality to reset existing ingresses/rooms for a host and
 * to create new ingress endpoints (RTMP or WHIP) for live streaming.
 *
 * These functions run exclusively on the server (`"use server"`) and
 * interact directly with the LiveKit Server SDK and the application database.
 *
 * @remarks
 * This module assumes a 1:1 mapping between a user (host) and a LiveKit
 * room, where the room name is always equal to the host's user ID.
 * Ingress creation is therefore destructive by design: creating a new
 * ingress for a host always tears down any prior room/ingress state for
 * that host (see {@link resetIngresses}).
 *
 * @requires next/cache
 * @requires @livekit/protocol
 * @requires livekit-server-sdk
 * @requires @/lib/auth-service
 * @requires @/lib/db
 */

"use server";

import { revalidatePath } from "next/cache";

import { IngressAudioOptions, IngressVideoOptions } from "@livekit/protocol";
import {
  type CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressClient,
  IngressInput,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  TrackSource,
} from "livekit-server-sdk";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Base URL of the LiveKit server instance.
 *
 * @internal
 * @type {string | undefined}
 * @see {@link https://docs.livekit.io/realtime/self-hosting/deployment/ | LiveKit Deployment Docs}
 */
const apiUrl = process.env.LIVEKIT_API_URL;

/**
 * API key used to authenticate requests against the LiveKit server.
 *
 * @internal
 * @type {string | undefined}
 */
const apiKey = process.env.LIVEKIT_API_KEY;

/**
 * API secret used to authenticate requests against the LiveKit server.
 *
 * @internal
 * @type {string | undefined}
 */
const apiSecret = process.env.LIVEKIT_API_SECRET;

/**
 * Guard clause to ensure all required LiveKit environment variables
 * are present before the module is used. Prevents silent failures
 * caused by misconfigured environments.
 *
 * @throws {Error} If any of `LIVEKIT_API_URL`, `LIVEKIT_API_KEY`,
 *                 or `LIVEKIT_API_SECRET` are not set.
 */
if (!apiUrl || !apiKey || !apiSecret) {
  throw new Error(
    "LIVEKIT_API_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET must be set in the environment variables",
  );
}

/**
 * Singleton client used to manage LiveKit rooms
 * (creation, deletion, listing, etc.).
 *
 * @internal
 * @type {RoomServiceClient}
 */
const roomService = new RoomServiceClient(apiUrl, apiKey, apiSecret);

/**
 * Singleton client used to manage LiveKit ingress endpoints
 * (RTMP/WHIP stream ingestion points).
 *
 * @internal
 * @type {IngressClient}
 */
const ingressClient = new IngressClient(apiUrl);

/**
 * Resets all active ingresses and rooms associated with a given host.
 *
 * This is typically called before creating a new ingress to ensure
 * that a host cannot have multiple simultaneous stream connections,
 * preventing orphaned rooms or duplicate stream keys.
 *
 * @async
 * @function resetIngresses
 * @param {string} hostIdentity - The unique identifier (user ID) of the
 *                                 host whose rooms and ingresses should
 *                                 be reset. This value is assumed to be
 *                                 identical to the LiveKit room name.
 * @returns {Promise<void>} Resolves once all matching rooms and ingresses
 *                          have been deleted.
 *
 * @remarks
 * Room and ingress deletions are performed sequentially rather than in
 * parallel to avoid overwhelming the LiveKit server with concurrent
 * delete requests for what is typically a very small number of resources
 * (usually zero or one of each).
 *
 * @example
 * ```ts
 * await resetIngresses("user_123");
 * ```
 */
export async function resetIngresses(hostIdentity: string): Promise<void> {
  // Fetch all ingress endpoints currently associated with the host's room.
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity,
  });

  // Fetch the room(s) matching the host identity (LiveKit rooms are
  // named after the host's user ID in this implementation).
  const rooms = await roomService.listRooms([hostIdentity]);

  // Delete any existing rooms to terminate active sessions.
  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  // Delete any existing ingress endpoints to invalidate old stream keys/URLs.
  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
}

/**
 * In-process per-user locks used to serialize ingress replacement.
 *
 * Each key is a user ID; the corresponding value is a promise that
 * resolves once the current {@link createIngress} operation for that
 * user has fully completed (including cleanup). This guarantees that
 * concurrent calls to `createIngress` for the same user are executed
 * strictly one at a time, preventing race conditions such as:
 * - Two ingresses being created for the same user simultaneously.
 * - A reset operation deleting resources created by a concurrent call.
 *
 * @internal
 * @type {Map<string, Promise<void>>}
 *
 * @remarks
 * This lock is **process-local** and does not provide synchronization
 * across multiple server instances/replicas. In a horizontally scaled
 * deployment, an external distributed lock (e.g. Redis-based) would be
 * required to fully eliminate cross-instance race conditions.
 */
const userLocks = new Map<string, Promise<void>>();

/**
 * The set of {@link IngressInput} types supported by this application's
 * `createIngress` action.
 *
 * @internal
 * @type {Set<IngressInput>}
 *
 * @remarks
 * `IngressInput.URL_INPUT` is intentionally excluded because the
 * application UI does not currently collect the source URL required
 * to configure a pull-based ingress.
 */
const SUPPORTED_INGRESS_TYPES = new Set([
  IngressInput.RTMP_INPUT,
  IngressInput.WHIP_INPUT,
]);

/**
 * Result payload returned by {@link createIngress} upon successful
 * ingress creation.
 *
 * @internal
 * @typedef {Object} CreateIngressResult
 * @property {string} ingressId - Unique identifier of the created ingress.
 * @property {string} url - The server URL clients should stream to.
 * @property {string} streamKey - The secret stream key required to
 *                                 authenticate the stream.
 */

/**
 * Creates a new LiveKit ingress endpoint for the currently authenticated
 * user, allowing them to stream via RTMP or WHIP protocols.
 *
 * Before creation, any existing ingresses/rooms for the user are reset
 * via {@link resetIngresses} to avoid conflicting stream configurations.
 * Concurrent calls for the same user are serialized via an in-process
 * per-user lock (see {@link userLocks}) to prevent races.
 *
 * Depending on the `ingressType`:
 * - `WHIP_INPUT`: Transcoding is disabled, since WHIP clients typically
 *   send pre-encoded, browser-compatible media.
 * - `RTMP_INPUT`: Video and audio encoding presets are explicitly
 *   configured for compatibility and quality (1080p H.264 video,
 *   stereo Opus audio).
 *
 * On success, the generated ingress details (server URL and stream key)
 * are persisted to the database against the user's stream record, and
 * the `/u/[username]/keys` page cache is invalidated so the UI reflects
 * the new credentials. If the database update fails, the newly created
 * LiveKit ingress is deleted before the error propagates, to avoid
 * leaving orphaned resources on the LiveKit server.
 *
 * @async
 * @function createIngress
 * @param {IngressInput} ingressType - The type of ingress to create.
 *        Only `IngressInput.RTMP_INPUT` and `IngressInput.WHIP_INPUT`
 *        are currently supported.
 * @returns {Promise<CreateIngressResult>}
 *          A plain, serializable object containing the created ingress's
 *          ID, server URL, and stream key.
 *
 * @throws {Error} If `ingressType` is not a supported type
 *                 (e.g. `URL_INPUT`).
 * @throws {Error} If the authenticated user cannot be resolved
 *                 (via {@link getSelf}).
 * @throws {Error} If ingress creation fails or returns incomplete data
 *                 (missing `url` or `streamKey`).
 * @throws {Error} Propagates the original database error if persisting
 *                 the ingress details to the database fails, after
 *                 attempting best-effort cleanup of the created ingress.
 *
 * @example
 * ```ts
 * const ingress = await createIngress(IngressInput.RTMP_INPUT);
 * console.log(ingress.url, ingress.streamKey);
 * ```
 */
export async function createIngress(
  ingressType: IngressInput,
): Promise<{ ingressId: string; url: string; streamKey: string }> {
  // Validate ingressType before touching auth or existing resources,
  // to fail fast on invalid input without incurring unnecessary I/O.
  if (!SUPPORTED_INGRESS_TYPES.has(ingressType)) {
    throw new Error(
      `Unsupported ingress type: ${ingressType}. Only RTMP_INPUT and WHIP_INPUT are supported.`,
    );
  }

  // Resolve the currently authenticated user.
  const self = await getSelf();

  // --- Per-user lock acquisition -------------------------------------
  // Serialize per-user to prevent concurrent replacements from
  // racing and orphaning LiveKit resources.
  //
  // `prev` captures the in-flight operation (if any) for this user.
  // `gate` is a new promise representing *this* invocation's completion;
  // it is chained after `prev` and stored back into the lock map so that
  // any subsequent call will wait for this invocation to finish first.
  const prev = userLocks.get(self.id) ?? Promise.resolve();
  let releaseLock!: () => void;
  const gate = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });
  userLocks.set(
    self.id,
    prev.then(() => gate),
  );

  // Wait for any prior operation for this user to complete before
  // proceeding with reset + creation.
  await prev;

  try {
    // Clear out any pre-existing ingress/room state for this user
    // to prevent duplicate or stale stream connections.
    await resetIngresses(self.id);

    /**
     * Base configuration shared across all ingress types.
     * @type {CreateIngressOptions}
     */
    const options: CreateIngressOptions = {
      name: self.username,
      roomName: self.id,
      participantName: self.username,
      participantIdentity: self.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
      // WHIP inputs are typically sent pre-encoded; disable transcoding
      // to reduce server load and latency.
      options.enableTranscoding = false;
    } else {
      // For RTMP (and other non-WHIP) inputs, explicitly configure
      // video/audio encoding presets for consistent output quality.
      options.video = new IngressVideoOptions({
        source: TrackSource.CAMERA,
        encodingOptions: {
          case: "preset",
          value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
        },
      });
      options.audio = new IngressAudioOptions({
        source: TrackSource.MICROPHONE,
        encodingOptions: {
          case: "preset",
          value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
        },
      });
    }

    // Request ingress creation from the LiveKit server.
    const ingress = await ingressClient.createIngress(ingressType, options);

    // Validate that the server returned usable connection details.
    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new Error("Failed to create ingress");
    }

    // Persist the new ingress details to the user's stream record.
    // If this fails, delete the newly created ingress to avoid orphans.
    try {
      await db.stream.update({
        where: { userId: self.id },
        data: {
          ingressId: ingress.ingressId,
          serverUrl: ingress.url,
          streamKey: ingress.streamKey,
        },
      });
    } catch (dbError) {
      // Best-effort cleanup: remove the LiveKit ingress we just created
      // so it doesn't become an orphaned resource. Cleanup failures are
      // intentionally swallowed so the original `dbError` is what
      // propagates to the caller.
      if (ingress.ingressId) {
        await ingressClient.deleteIngress(ingress.ingressId).catch(() => {});
      }
      throw dbError;
    }

    // Invalidate the cached "keys" page so the new stream credentials
    // are immediately visible to the user.
    revalidatePath(`/u/${self.username}/keys`);

    // Return a plain, serializable object for use by callers
    // (including client components via server actions).
    return {
      ingressId: ingress.ingressId!,
      url: ingress.url,
      streamKey: ingress.streamKey,
    };
  } finally {
    // --- Per-user lock release ----------------------------------------
    // Release the gate so any queued operation for this user can proceed,
    // regardless of whether this invocation succeeded or failed.
    releaseLock();

    // Clean up the lock map entry only if no other operation has been
    // queued behind this one (i.e. this invocation's chained promise is
    // still the one registered in the map). This prevents accidentally
    // deleting a newer lock registered by a subsequent concurrent call.
    if (userLocks.get(self.id) === prev.then(() => gate)) {
      userLocks.delete(self.id);
    }
  }
}
