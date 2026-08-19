import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Checks whether the user with the given id has blocked the currently
 * authenticated user.
 *
 * A user is never considered to be blocked by themselves — if `id` matches
 * the current user's own id, `false` is returned immediately. Any error
 * that occurs during the lookup (e.g. no authenticated session, user not
 * found) is silently caught and results in `false` being returned.
 *
 * @param id - The id of the user to check as a potential blocker.
 * @returns `true` if the given user has blocked the current user,
 * otherwise `false`.
 */
export async function isBlockedByUser(id: string): Promise<boolean> {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return false;
    }

    const isBlocked = await db.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: otherUser.id,
          blockedId: self.id,
        },
      },
    });

    return !!isBlocked;
  } catch {
    return false;
  }
}

/**
 * Creates a block relationship from the currently authenticated user
 * toward the user with the given id.
 *
 * @param id - The id of the user to block.
 * @returns The created block record, including the `blocked` user relation.
 * @throws {Error} `"Cannot block yourself"` — If `id` matches the current
 * user's own id.
 * @throws {Error} `"User not found"` — If no user record exists for `id`.
 * @throws {Error} `"Already blocked"` — If a block relationship already
 * exists from the current user toward the target user.
 */
export async function blockUser(id: string) {
  const self = await getSelf();

  if (id === self.id) {
    throw new Error("Cannot block yourself");
  }

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  try {
    const blockedUser = await db.block.create({
      data: {
        blockerId: self.id,
        blockedId: otherUser.id,
      },
      include: {
        blocked: true,
      },
    });

    return blockedUser;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error("Already blocked");
    }
    throw error;
  }
}

/**
 * Removes the block relationship from the currently authenticated user
 * toward the user with the given id.
 *
 * @param id - The id of the user to unblock.
 * @returns The deleted block record, including the `blocked` user relation.
 * @throws {Error} `"Cannot unblock yourself"` — If `id` matches the current
 * user's own id.
 * @throws {Error} `"User not found"` — If no user record exists for `id`.
 * @throws {Error} `"Not blocked"` — If no block relationship exists from
 * the current user toward the target user.
 */
export async function unblockUser(id: string) {
  const self = await getSelf();

  if (id === self.id) {
    throw new Error("Cannot unblock yourself");
  }

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  try {
    const unblockedUser = await db.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId: self.id,
          blockedId: otherUser.id,
        },
      },
      include: {
        blocked: true,
      },
    });

    return unblockedUser;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      throw new Error("Not blocked");
    }
    throw error;
  }
}

/**
 * Retrieves all users blocked by the currently authenticated user.
 *
 * Queries the `block` table for every record where the authenticated user
 * is the blocker, selecting only the fields needed for display from the
 * `blocked` user relation (`id`, `imageUrl`, `username`, `createdAt`).
 *
 * @returns An array of block records, each including a narrowed `blocked`
 *   user relation with only the fields required by the community page.
 *   Returns an empty array if the authenticated user has not blocked anyone.
 * @throws {Error} If the current user cannot be authenticated (propagated
 *   from {@link getSelf}) or if the database query fails.
 */
export async function getBlockedUsers() {
  const self = await getSelf();

  const blockedUsers = await db.block.findMany({
    where: {
      blockerId: self.id,
    },
    include: {
      blocked: {
        select: {
          id: true,
          imageUrl: true,
          username: true,
          createdAt: true,
        },
      },
    },
  });

  return blockedUsers;
}
