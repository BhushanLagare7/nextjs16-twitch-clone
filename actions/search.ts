/**
 * @file actions/search.ts
 * @description Server action for fetching paginated search results on demand.
 *
 * @module SearchActions
 */

"use server";

import { getSearch } from "@/lib/search-service";

/**
 * Server action to fetch paginated search results for client components.
 *
 * @param {string} [term] - The search query term.
 * @param {string} [cursor] - The cursor stream ID for pagination continuation.
 * @returns {Promise<{ items: Array<Stream & { user: Pick<User, "username" | "imageUrl"> }>; nextCursor: string | null }>}
 *          The search results page and the next cursor.
 */
export async function getMoreSearchResults(term?: string, cursor?: string) {
  return await getSearch(term, cursor);
}
