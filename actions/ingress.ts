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
 * LiveKit server connection credentials, sourced from environment variables.
 * These must be defined at runtime; the application will throw on startup
 * if any of them are missing.
 *
 * @constant {string} apiUrl - Base URL of the LiveKit server instance.
 * @constant {string} apiKey - API key used to authenticate with LiveKit.
 * @constant {string} apiSecret - API secret used to authenticate with LiveKit.
 */
const apiUrl = process.env.LIVEKIT_API_URL;
const apiKey = process.env.LIVEKIT_API_KEY;
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
 * @type {RoomServiceClient}
 */
const roomService = new RoomServiceClient(apiUrl, apiKey, apiSecret);

/**
 * Singleton client used to manage LiveKit ingress endpoints
 * (RTMP/WHIP stream ingestion points).
 *
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
 *                                 be reset.
 * @returns {Promise<void>} Resolves once all matching rooms and ingresses
 *                          have been deleted.
 *
 * @example
 * await resetIngresses("user_123");
 */
export async function resetIngresses(hostIdentity: string) {
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
 * In-process per-user locks to serialize ingress replacement.
 * Each key is a user ID; the value is a promise chain that
 * ensures only one createIngress operation runs at a time per user.
 *
 * @type {Map<string, Promise<void>>}
 */
const userLocks = new Map<string, Promise<void>>();

/**
 * Supported ingress input types for this application.
 * URL_INPUT is excluded because the UI does not provide
 * the required source URL.
 */
const SUPPORTED_INGRESS_TYPES = new Set([
  IngressInput.RTMP_INPUT,
  IngressInput.WHIP_INPUT,
]);

/**
 * Creates a new LiveKit ingress endpoint for the currently authenticated
 * user, allowing them to stream via RTMP or WHIP protocols.
 *
 * Before creation, any existing ingresses/rooms for the user are reset
 * via {@link resetIngresses} to avoid conflicting stream configurations.
 * Concurrent calls for the same user are serialized via an in-process
 * per-user lock to prevent races.
 *
 * Depending on the `ingressType`:
 * - `WHIP_INPUT`: Transcoding is disabled (WHIP clients typically send
 *   pre-encoded, browser-compatible media).
 * - `RTMP_INPUT`: Video and audio encoding presets are explicitly
 *   configured for compatibility and quality (1080p H.264 video,
 *   stereo Opus audio).
 *
 * On success, the generated ingress details (server URL and stream key)
 * are persisted to the database against the user's stream record, and
 * the `/u/[username]/keys` page cache is invalidated so the UI reflects
 * the new credentials. If the database update fails, the newly created
 * LiveKit ingress is deleted before the error propagates.
 *
 * @async
 * @function createIngress
 * @param {IngressInput} ingressType - The type of ingress to create.
 *        Only `IngressInput.RTMP_INPUT` and `IngressInput.WHIP_INPUT`
 *        are supported.
 * @returns {Promise<{ ingressId: string; url: string; streamKey: string }>}
 *          A plain, serializable object containing the created ingress's
 *          ID, server URL, and stream key.
 *
 * @throws {Error} If `ingressType` is not a supported type
 *                 (e.g. `URL_INPUT`).
 * @throws {Error} If the authenticated user cannot be resolved
 *                 (via {@link getSelf}).
 * @throws {Error} If ingress creation fails or returns incomplete data
 *                 (missing `url` or `streamKey`).
 *
 * @example
 * const ingress = await createIngress(IngressInput.RTMP_INPUT);
 * console.log(ingress.url, ingress.streamKey);
 */
export async function createIngress(ingressType: IngressInput) {
  // Validate ingressType before touching auth or existing resources.
  if (!SUPPORTED_INGRESS_TYPES.has(ingressType)) {
    throw new Error(
      `Unsupported ingress type: ${ingressType}. Only RTMP_INPUT and WHIP_INPUT are supported.`,
    );
  }

  // Resolve the currently authenticated user.
  const self = await getSelf();

  // Serialize per-user to prevent concurrent replacements from
  // racing and orphaning LiveKit resources.
  const prev = userLocks.get(self.id) ?? Promise.resolve();
  let releaseLock: () => void;
  const gate = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });
  userLocks.set(self.id, prev.then(() => gate));

  // Wait for any prior operation for this user to complete.
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
      // so it doesn't become an orphaned resource.
      if (ingress.ingressId) {
        await ingressClient
          .deleteIngress(ingress.ingressId)
          .catch(() => {}); // Swallow cleanup errors to propagate the original.
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
    // Release the per-user lock regardless of success or failure.
    releaseLock!();
    // Clean up the lock map entry if no other operation is queued.
    if (userLocks.get(self.id) === prev.then(() => gate)) {
      userLocks.delete(self.id);
    }
  }
}
