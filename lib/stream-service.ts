import { db } from "@/lib/db";

/**
 * Retrieves the stream owned by a given user.
 *
 * @param userId - The ID of the user whose stream should be fetched.
 * @returns The matching `Stream` record, or `null` if the user has no stream.
 */
export async function getStreamByUserId(userId: string) {
  const stream = await db.stream.findUnique({
    where: {
      userId,
    },
  });

  return stream;
}
