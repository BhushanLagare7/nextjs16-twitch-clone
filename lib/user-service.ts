import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";

/**
 * Prisma select object defining the stream fields required by
 * `StreamPlayer`. Kept narrow to avoid over-fetching.
 */
const streamPlayerStreamSelect = {
  id: true,
  isLive: true,
  isChatDelayed: true,
  isChatEnabled: true,
  isChatFollowersOnly: true,
  thumbnailUrl: true,
  name: true,
} satisfies Prisma.StreamSelect;

/**
 * Prisma select object defining the user fields required by
 * `StreamPlayer`. Deliberately excludes `externalUserId` to
 * prevent leaking auth-sensitive data to client components.
 */
const streamPlayerUserSelect = {
  id: true,
  username: true,
  bio: true,
  imageUrl: true,
  stream: {
    select: streamPlayerStreamSelect,
  },
  _count: {
    select: {
      followedBy: true,
    },
  },
} satisfies Prisma.UserSelect;

/**
 * Prisma-derived user type containing only the fields consumed by
 * `StreamPlayer`. Does not include `externalUserId`.
 */
export type StreamPlayerUser = Prisma.UserGetPayload<{
  select: typeof streamPlayerUserSelect;
}>;

/**
 * Prisma-derived stream type matching the stream sub-selection within
 * {@link StreamPlayerUser}.
 */
export type StreamPlayerStream = NonNullable<StreamPlayerUser["stream"]>;

/**
 * Retrieves a user by their unique username, including their stream
 * configuration and follower count.
 *
 * Used primarily for public-facing profile/stream pages where only a
 * limited subset of user fields should be exposed. Does **not** include
 * `externalUserId`; use {@link getUserByUsernameWithExternalId} for authorization checks.
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
    select: streamPlayerUserSelect,
  });

  return user;
}

/**
 * Retrieves a user by their unique username, including both the public fields
 * required by `StreamPlayer` and `externalUserId` for server-side authorization checks.
 *
 * @param username - The unique username to look up.
 * @returns The matching user record including `externalUserId`, or `null` if not found.
 */
export async function getUserByUsernameWithExternalId(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      ...streamPlayerUserSelect,
      externalUserId: true,
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
