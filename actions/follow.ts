// lib/follow-actions.ts
"use server";

import { revalidatePath } from "next/cache";

import { followUser, unfollowUser } from "@/lib/follow-service";

/**
 * Executes a follow/unfollow service call, revalidates the affected paths,
 * and normalizes any thrown error into a generic "Internal Error".
 *
 * @param action - A function performing the follow/unfollow operation.
 * @returns The result returned by `action`.
 * @throws {Error} Always throws "Internal Error" if `action` fails for any reason.
 */
async function handleFollowChange<
  T extends { following: { username: string } } | null | undefined,
>(action: () => Promise<T>): Promise<T> {
  try {
    const result = await action();

    revalidatePath("/");

    if (result) {
      revalidatePath(`/${result.following.username}`);
    }

    return result;
  } catch {
    throw new Error("Internal Error");
  }
}

/**
 * Server action that follows the given user and revalidates related paths.
 *
 * @param id - The id of the user to follow.
 * @returns The created follow record.
 * @throws {Error} "Internal Error" if the underlying follow operation fails.
 */
export async function onFollow(id: string) {
  return handleFollowChange(() => followUser(id));
}

/**
 * Server action that unfollows the given user and revalidates related paths.
 *
 * @param id - The id of the user to unfollow.
 * @returns The deleted follow record.
 * @throws {Error} "Internal Error" if the underlying unfollow operation fails.
 */
export async function onUnfollow(id: string) {
  return handleFollowChange(() => unfollowUser(id));
}
