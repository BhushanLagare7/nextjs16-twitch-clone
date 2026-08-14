/**
 * @file actions/token.ts
 * @description Server action for generating LiveKit viewer access tokens.
 *
 * Handles token creation for both authenticated users and unauthenticated
 * guests, enforcing access control checks (e.g., block status) before
 * issuing a signed JWT that grants permission to join a LiveKit room.
 *
 * @module token
 */

"use server";

import { AccessToken } from "livekit-server-sdk";
import { v4 } from "uuid";

import { getSelf } from "@/lib/auth-service";
import { isBlockedByUser } from "@/lib/block-service";
import { getUserById } from "@/lib/user-service";

/**
 * Generates a signed LiveKit JWT granting the current user (or a guest)
 * permission to join the specified host's stream room as a viewer.
 *
 * ### Behaviour
 * - If the requester is authenticated, their real identity is used.
 * - If the requester is unauthenticated, a temporary guest identity is
 *   created using a UUID and a randomly generated guest username.
 * - If the requester is the host, their identity is prefixed with `"host-"`
 *   to distinguish them from regular viewers inside the LiveKit room.
 * - Viewers are granted `roomJoin` and `canPublishData` permissions only;
 *   `canPublish` (audio/video) is explicitly denied.
 *
 * @async
 * @function createViewerToken
 *
 * @param {string} hostIdentity - The database ID of the user who owns the
 *   stream room (used as the LiveKit room name).
 *
 * @returns {Promise<string>} A promise that resolves to a signed LiveKit
 *   JWT string that the client can use to connect to the room.
 *
 * @throws {Error} If the host user is not found in the database.
 * @throws {Error} If the requesting user is blocked by the host.
 * @throws {Error} If `LIVEKIT_API_KEY` or `LIVEKIT_API_SECRET` environment
 *   variables are not set.
 *
 * @example
 * // Inside a client-side hook (called via server action bridge)
 * const jwt = await createViewerToken("host-user-id-123");
 */
export async function createViewerToken(hostIdentity: string) {
  let self;

  try {
    // Attempt to resolve the currently authenticated user.
    self = await getSelf();
  } catch {
    // Requester is unauthenticated — generate a temporary guest identity.
    const id = v4();
    const username = `guest#${Math.floor(Math.random() * 1000)}`;
    self = { id, username };
  }

  const host = await getUserById(hostIdentity);

  if (!host) {
    throw new Error("User not found");
  }

  const isBlocked = await isBlockedByUser(host.id);

  if (isBlocked) {
    throw new Error("User is blocked");
  }

  // Distinguish the host from regular viewers inside the LiveKit room.
  const isHost = self.id === host.id;

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "LIVEKIT_API_KEY and LIVEKIT_API_SECRET are missing in the environment variables",
    );
  }

  // Construct the access token with the resolved identity and display name.
  const token = new AccessToken(apiKey!, apiSecret!, {
    identity: isHost ? `host-${self.id}` : self.id,
    name: self.username,
  });

  // Grant viewer-level permissions: join the room and send data messages,
  // but do not allow publishing audio or video tracks.
  token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: false,
    canPublishData: true,
  });

  return await Promise.resolve(token.toJwt());
}
