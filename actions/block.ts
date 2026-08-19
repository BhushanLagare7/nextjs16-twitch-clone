/**
 * @file block.ts
 * @description Server actions for managing user blocking functionality.
 * Handles blocking/unblocking users and removing blocked participants from live rooms.
 */

"use server";

import { revalidatePath } from "next/cache";

import { RoomServiceClient } from "livekit-server-sdk";

import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/block-service";

/** LiveKit server API URL, used to connect to the LiveKit room service. */
const apiUrl = process.env.LIVEKIT_API_URL;

/** LiveKit API key for authenticating with the LiveKit server. */
const apiKey = process.env.LIVEKIT_API_KEY;

/** LiveKit API secret for authenticating with the LiveKit server. */
const apiSecret = process.env.LIVEKIT_API_SECRET;

// Ensure all required LiveKit environment variables are set before proceeding.
if (!apiUrl || !apiKey || !apiSecret) {
  throw new Error(
    "LIVEKIT_API_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET must be set in the environment variables",
  );
}

/**
 * LiveKit RoomServiceClient instance for managing room participants.
 * Used to remove blocked users from active live streams.
 */
const roomService = new RoomServiceClient(apiUrl, apiKey, apiSecret);

/**
 * Blocks a user by their ID and removes them from the current user's live room (if present).
 *
 * - Attempts to block the user in the database via `blockUser`.
 * - Errors (e.g. "Cannot block yourself", "Already blocked", or database
 *   failures) are intentionally not caught so callers can distinguish
 *   success from failure and show the correct toast.
 * - Attempts to remove the blocked user from the active LiveKit room.
 * - Silently handles the case where the user is not in the room.
 * - Revalidates the community page to reflect the updated block list.
 *
 * @param {string} id - The ID of the user to block.
 * @returns {Promise<object>} The created block record returned from the database.
 */
export async function onBlock(id: string) {
  // Retrieve the currently authenticated user.
  const self = await getSelf();

  // Block the user in the database. Errors (e.g. "Cannot block yourself",
  // "Already blocked", or database failures) are intentionally not caught
  // so callers (e.g. community-item.tsx) can distinguish success from
  // failure and show the correct toast.
  const blockedUser = await blockUser(id);

  try {
    // Attempt to remove the blocked user from the current user's LiveKit room.
    await roomService.removeParticipant(self.id, id);
  } catch {
    // Silently ignore errors — this likely means the user is not
    // currently present in the live room.
  }

  // Revalidate the community page to reflect the updated block list.
  revalidatePath(`/u/${self.username}/community`);

  return blockedUser;
}

/**
 * Unblocks a previously blocked user by their ID.
 *
 * - Unblocks the user in the database via `unblockUser`.
 * - Revalidates the current user's community page to reflect the updated block list.
 *
 * @param {string} id - The ID of the user to unblock.
 * @returns {Promise<object>} The deleted block record returned from the database.
 */
export async function onUnblock(id: string) {
  const self = await getSelf();
  // Remove the block relationship from the database.
  const unblockedUser = await unblockUser(id);

  revalidatePath(`/u/${self.username}/community`);

  return unblockedUser;
}
