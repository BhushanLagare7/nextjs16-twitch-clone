import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Fetches a list of streams, ordered by live status and recency.
 *
 * If the current user is authenticated (via `getSelf`), streams belonging
 * to users who have blocked the current user are excluded from the results.
 * If the user is not authenticated (or `getSelf` throws), all streams are
 * returned without filtering.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of
 * stream objects, each containing `id`, `user`, `isLive`, `name`, and
 * `thumbnailUrl`. Streams are ordered with live streams first, then by
 * most recently updated.
 */
export async function getStreams() {
  // Attempt to resolve the current authenticated user's ID.
  // If getSelf() throws (e.g. user not logged in), treat as anonymous.
  let userId = null;

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

  // Build the where clause conditionally:
  // - Authenticated users should not see streams from users blocking them.
  // - Anonymous users see all streams (no filtering).
  const where = userId
    ? {
        user: {
          NOT: {
            blocking: {
              some: {
                blockedId: userId,
              },
            },
          },
        },
      }
    : undefined;

  // Single query shared by both authenticated and anonymous paths.
  const streams = await db.stream.findMany({
    where,
    select: {
      id: true,
      user: true,
      isLive: true,
      name: true,
      thumbnailUrl: true,
    },
    orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
  });

  return streams;
}
