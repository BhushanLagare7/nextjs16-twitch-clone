/**
 * @file Service functions for fetching recommended users from the database.
 */

import { db } from "@/lib/db";

/** Maximum number of recommended users fetched for the sidebar list. */
export const RECOMMENDED_LIMIT = 10;

/**
 * getRecommended
 *
 * Fetches recommended users from the database, ordered by creation date (newest first).
 * Bounded by RECOMMENDED_LIMIT to populate the sidebar's recommended users list.
 *
 * This is a server-side function intended to be called from async server components
 * such as the `Sidebar` component.
 *
 * @async
 * @returns {Promise<User[]>} A promise that resolves to an array of recommended users,
 *   sorted in descending order by `createdAt`.
 *
 * @example
 * const recommended = await getRecommended();
 */
export async function getRecommended() {
  const users = await db.user.findMany({
    take: RECOMMENDED_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}
