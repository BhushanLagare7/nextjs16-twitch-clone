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
 *   by newest first, *excluding* the currently authenticated user's own record.
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
  let userId;

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

  let users = [];

  if (userId) {
    /*
     * Authenticated path: exclude the current user's own record from
     * recommendations so they do not appear in their own sidebar list.
     */
    users = await db.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: RECOMMENDED_LIMIT,
    });
  } else {
    /*
     * Unauthenticated path: return all users ordered by newest first
     * with no exclusion filter applied.
     */
    users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: RECOMMENDED_LIMIT,
    });
  }

  return users;
}
