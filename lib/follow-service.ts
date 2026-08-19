import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Fetches the list of users the currently authenticated user follows.
 *
 * Any error during the lookup (e.g. no authenticated user) is silently
 * caught and results in an empty array being returned.
 *
 * @returns An array of follow records (including the `following` user
 * relation with their associated `stream` data), or an empty array if
 * the lookup fails for any reason.
 */
export async function getFollowedUsers() {
  try {
    const self = await getSelf();

    const followedUsers = await db.follow.findMany({
      where: {
        followerId: self.id,
        following: {
          blocking: {
            none: {
              blockedId: self.id,
            },
          },
        },
      },
      include: {
        following: {
          include: {
            stream: {
              select: { isLive: true },
            },
          },
        },
      },
      orderBy: [
        { following: { stream: { isLive: "desc" } } },
        { createdAt: "desc" },
      ],
    });

    return followedUsers;
  } catch {
    return [];
  }
}

/**
 * Fetches the currently authenticated user and the target user by id.
 *
 * @param id - The id of the target user to fetch.
 * @returns An object containing the authenticated user (`self`) and the
 * target user (`otherUser`).
 * @throws {Error} `"User not found"` — If no user record exists for `id`.
 */
async function getSelfAndTargetUser(id: string) {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  return { self, otherUser };
}

/**
 * Looks up an existing follow relationship between two users.
 *
 * @param followerId - The id of the user doing the following.
 * @param followingId - The id of the user being followed.
 * @returns The existing follow record, or `null` if no such relationship
 * exists.
 */
function getExistingFollow(followerId: string, followingId: string) {
  return db.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });
}

/**
 * Determines whether the currently authenticated user is following the
 * given user.
 *
 * A user is considered to be "following" themselves — if `id` matches the
 * current user's own id, `true` is returned immediately. Any error during
 * the check (e.g. no authenticated session, target user not found) is
 * silently caught and results in `false` being returned.
 *
 * @param id - The id of the user to check.
 * @returns `true` if the current user follows the given user (or is the
 * same user), otherwise `false`.
 */
export async function isFollowingUser(id: string) {
  try {
    const { self, otherUser } = await getSelfAndTargetUser(id);

    if (otherUser.id === self.id) {
      return true;
    }

    const existingFollow = await getExistingFollow(self.id, otherUser.id);

    return !!existingFollow;
  } catch {
    return false;
  }
}

/**
 * Creates a follow relationship from the currently authenticated user to
 * the target user.
 *
 * @param id - The id of the user to follow.
 * @returns The created follow record, including the `follower` and
 * `following` relations.
 * @throws {Error} `"User not found"` — If no user record exists for `id`.
 * @throws {Error} `"Cannot follow yourself"` — If `id` matches the current
 * user's own id.
 * @throws {Error} `"Already following"` — If a follow relationship already
 * exists from the current user toward the target user.
 */
export async function followUser(id: string) {
  const { self, otherUser } = await getSelfAndTargetUser(id);

  if (otherUser.id === self.id) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollow = await getExistingFollow(self.id, otherUser.id);

  if (existingFollow) {
    throw new Error("Already following");
  }

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });

  return follow;
}

/**
 * Removes the follow relationship from the currently authenticated user to
 * the target user.
 *
 * @param id - The id of the user to unfollow.
 * @returns The deleted follow record, including the `following` relation.
 * @throws {Error} `"User not found"` — If no user record exists for `id`.
 * @throws {Error} `"Cannot unfollow yourself"` — If `id` matches the
 * current user's own id.
 * @throws {Error} `"Not following"` — If no follow relationship exists from
 * the current user toward the target user.
 */
export async function unfollowUser(id: string) {
  const { self, otherUser } = await getSelfAndTargetUser(id);

  if (otherUser.id === self.id) {
    throw new Error("Cannot unfollow yourself");
  }

  const existingFollow = await getExistingFollow(self.id, otherUser.id);

  if (!existingFollow) {
    throw new Error("Not following");
  }

  const follow = await db.follow.delete({
    where: {
      id: existingFollow.id,
    },
    include: {
      following: true,
    },
  });

  return follow;
}
