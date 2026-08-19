/**
 * @file lib/recommended-service.ts
 * @description Service functions for fetching recommended users.
 */

import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";

import { getSelf } from "./auth-service";

/**
 * Maximum number of recommended users returned by {@link getRecommended}.
 * Used to cap the sidebar's recommended users list.
 *
 * @constant {number}
 */
export const RECOMMENDED_LIMIT = 10;

/**
 * Fetches a list of recommended users to display in the sidebar.
 *
 * Behaviour varies depending on whether the caller is authenticated:
 * - **Authenticated**: Returns up to {@link RECOMMENDED_LIMIT} users ordered
 *   by newest first, excluding the current user's own record, any users they
 *   already follow, and any users who have blocked them.
 * - **Unauthenticated**: Returns up to {@link RECOMMENDED_LIMIT} users ordered
 *   by newest first with no exclusions applied.
 *
 * Authentication state is determined by calling `getSelf()`. If `getSelf()`
 * throws (e.g. no active session), the error is silently caught and the
 * function falls back to unauthenticated mode.
 *
 * @returns A promise resolving to an array of `User` records (including
 * their associated `stream` relation) sorted in descending order by
 * `createdAt`, containing at most {@link RECOMMENDED_LIMIT} entries.
 */
export async function getRecommended() {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    /*
     * `getSelf()` throws when there is no active session.
     * Treat the caller as unauthenticated and proceed without a userId
     * so the query does not apply any exclusion filter.
     */
    userId = null;
  }

  /*
   * Build the `where` clause conditionally:
   * - Authenticated: exclude the current user, anyone they already follow,
   *   and anyone who has blocked them.
   * - Unauthenticated: `undefined` applies no filter, matching Prisma's
   *   default "no where clause" behaviour.
   */
  const where: Prisma.UserWhereInput | undefined = userId
    ? {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followedBy: {
                some: { followerId: userId },
              },
            },
          },
          {
            NOT: {
              blocking: {
                some: { blockedId: userId },
              },
            },
          },
        ],
      }
    : undefined;

  const users = await db.user.findMany({
    where,
    include: {
      stream: {
        select: { isLive: true },
      },
    },
    orderBy: [{ stream: { isLive: "desc" } }, { createdAt: "desc" }],
    take: RECOMMENDED_LIMIT,
  });

  return users;
}
