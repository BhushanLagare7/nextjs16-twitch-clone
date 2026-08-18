import { db } from "@/lib/db";

/**
 * Retrieves a user by their unique username, including their stream
 * configuration and follower count.
 *
 * Used primarily for public-facing profile/stream pages where only a
 * limited subset of user fields should be exposed.
 *
 * @param username - The unique username to look up.
 * @returns The matching user (with `stream` and `_count.followedBy`
 *          selected), or `null` if no user is found.
 */
export async function getUserByUsername(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      externalUserId: true,
      username: true,
      bio: true,
      imageUrl: true,
      stream: {
        select: {
          id: true,
          isLive: true,
          isChatDelayed: true,
          isChatEnabled: true,
          isChatFollowersOnly: true,
          thumbnailUrl: true,
          name: true,
        },
      },
      _count: {
        select: {
          followedBy: true,
        },
      },
    },
  });

  return user;
}

/**
 * Retrieves a user by their internal database ID, including the full
 * related `stream` record.
 *
 * Unlike {@link getUserByUsername}, this returns the complete user model
 * (no field selection), so it should be used in internal/trusted contexts
 * where exposing all user fields is acceptable.
 *
 * @param id - The internal user ID to look up.
 * @returns The matching user (with the full `stream` relation included),
 *          or `null` if no user is found.
 */
export async function getUserById(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      stream: true,
    },
  });

  return user;
}
