import { Prisma, Stream, User } from "@/generated/prisma";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Maximum number of search results returned per page.
 * Used to enforce a bounded result set with cursor-based pagination.
 */
export const SEARCH_PAGE_SIZE = 20;

/**
 * Shape of a single search result item returned by {@link getSearch}.
 *
 * Matches exactly the fields selected by the search query: the core
 * stream display fields plus the streamer's public profile fields.
 */
export type SearchResultItem = Pick<
  Stream,
  "id" | "name" | "isLive" | "thumbnailUrl" | "updatedAt"
> & {
  user: Pick<User, "username" | "imageUrl">;
};

/**
 * Searches for streams by stream name or by the streamer's username.
 *
 * If a user is currently authenticated (via {@link getSelf}), any streams
 * belonging to users who have blocked that authenticated user are excluded
 * from the results. Only the expected "Unauthorized" error from `getSelf`
 * is treated as a guest request; database, authentication-service, and
 * other operational failures are propagated instead of being silently
 * swallowed.
 *
 * Results are bounded by {@link SEARCH_PAGE_SIZE} and support cursor-based
 * pagination via the `cursor` parameter.
 *
 * @param term - Optional search term matched (via substring) against the
 *               stream's `name` or the owning user's `username`.
 * @param cursor - Optional stream ID to continue pagination from. When
 *                 provided, results start after this record.
 * @returns An object containing `items` (the matching streams as
 *          {@link SearchResultItem} objects) and `nextCursor` (the ID to
 *          pass for the next page, or `null` if no more results exist).
 *          Items are ordered by live status first (live streams first),
 *          then by most recently updated, with `id` as a deterministic
 *          tie-breaker.
 */
export async function getSearch(
  term?: string,
  cursor?: string,
): Promise<{ items: SearchResultItem[]; nextCursor: string | null }> {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch (error) {
    // Only treat "Unauthorized" (not signed in) as anonymous access.
    // Any other error (e.g. "Not found" for missing local user record,
    // or database failures) should propagate.
    if (error instanceof Error && error.message === "Unauthorized") {
      userId = null;
    } else {
      throw error;
    }
  }

  const where: Prisma.StreamWhereInput = {
    OR: [
      { name: { contains: term, mode: "insensitive" } },
      { user: { username: { contains: term, mode: "insensitive" } } },
    ],
    // Only applied when a user is authenticated: exclude streams whose
    // owner has blocked the current user.
    ...(userId && {
      user: {
        NOT: {
          blocking: {
            some: { blockedId: userId },
          },
        },
      },
    }),
  };

  const streams = await db.stream.findMany({
    where,
    select: {
      user: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
      id: true,
      name: true,
      isLive: true,
      thumbnailUrl: true,
      updatedAt: true,
    },
    orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }, { id: "desc" }],
    take: SEARCH_PAGE_SIZE + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasMore = streams.length > SEARCH_PAGE_SIZE;
  const items = hasMore ? streams.slice(0, SEARCH_PAGE_SIZE) : streams;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor };
}
