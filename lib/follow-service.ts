import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Fetches the currently authenticated user and the target user by id.
 *
 * @param id - The id of the target user to fetch.
 * @returns An object containing the authenticated user (`self`) and the target user (`otherUser`).
 * @throws {Error} If the target user cannot be found ("User not found").
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
 * @returns The existing follow record, or `null` if no such relationship exists.
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
 * Determines whether the currently authenticated user is following the given user.
 *
 * A user is considered to be "following" themselves (returns `true` when
 * checking against their own id). Any error during the check (e.g. no
 * authenticated user, target user not found) results in `false`.
 *
 * @param id - The id of the user to check.
 * @returns `true` if the current user follows the given user (or is the same user), otherwise `false`.
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
 * Creates a follow relationship from the currently authenticated user to the target user.
 *
 * @param id - The id of the user to follow.
 * @returns The created follow record, including the `follower` and `following` relations.
 * @throws {Error} If the target user does not exist ("User not found"),
 * if the user attempts to follow themselves ("Cannot follow yourself"),
 * or if the follow relationship already exists ("Already following").
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
 * Removes the follow relationship from the currently authenticated user to the target user.
 *
 * @param id - The id of the user to unfollow.
 * @returns The deleted follow record, including the `following` relation.
 * @throws {Error} If the target user does not exist ("User not found"),
 * if the user attempts to unfollow themselves ("Cannot unfollow yourself"),
 * or if no follow relationship exists ("Not following").
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
