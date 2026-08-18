import { Prisma } from "@/generated/prisma";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Searches for streams by stream name or by the streamer's username.
 *
 * If a user is currently authenticated (via {@link getSelf}), any streams
 * belonging to users who have blocked that authenticated user are excluded
 * from the results. If no user is authenticated, all matching streams are
 * returned.
 *
 * @param term - Optional search term matched (via substring) against the
 *               stream's `name` or the owning user's `username`.
 * @returns A list of matching streams, each including its associated
 *          `user`, ordered by live status first (live streams first) and
 *          then by most recently updated.
 */
export async function getSearch(term?: string) {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  const where: Prisma.StreamWhereInput = {
    OR: [
      { name: { contains: term } },
      { user: { username: { contains: term } } },
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
    include: {
      user: true,
    },
    orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
  });

  return streams;
}
