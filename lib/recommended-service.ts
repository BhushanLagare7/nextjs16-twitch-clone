/**
 * @file lib/recommended-service.ts
 * @description Service functions for fetching recommended users from the database.
 */

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
 *   by newest first, *excluding* the currently authenticated user's own record
 *   and any users the current user already follows.
 * - **Unauthenticated**: Returns up to {@link RECOMMENDED_LIMIT} users ordered
 *   by newest first with no exclusions applied.
 *
 * Authentication state is determined by calling `getSelf()`. If `getSelf()`
 * throws (e.g., no active session), the error is silently caught and the
 * function proceeds in unauthenticated mode.
 *
 * This is a server-side function intended to be called from async server
 * components such as the `Sidebar` component.
 *
 * @async
 * @function getRecommended
 *
 * @returns {Promise<import("@prisma/client").User[]>} A promise that resolves
 *   to an array of Prisma `User` records sorted in descending order by
 *   `createdAt`, containing at most {@link RECOMMENDED_LIMIT} entries.
 *
 * @example
 * // Inside an async server component:
 * const recommended = await getRecommended();
 * recommended.forEach((user) => console.log(user.username));
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
   * - Authenticated: exclude the current user and anyone they already follow.
   * - Unauthenticated: `undefined` applies no filter, matching Prisma's
   *   default "no where clause" behaviour.
   */
  const where = userId
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
        ],
      }
    : undefined;

  const users = await db.user.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: RECOMMENDED_LIMIT,
  });

  return users;
}
