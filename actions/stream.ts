"use server";

import { revalidatePath } from "next/cache";

import { Stream } from "@/generated/prisma";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Updates the stream settings (name and chat configuration) for the
 * currently authenticated user's own stream.
 *
 * Only a fixed subset of fields (`name`, `isChatEnabled`,
 * `isChatFollowersOnly`, `isChatDelayed`) is persisted, regardless of what
 * other properties are present on `values`.
 *
 * After a successful update, revalidates the cached paths for the user's
 * chat settings page, profile page, and public channel page so the UI
 * reflects the latest values.
 *
 * @param values - Partial stream fields to update.
 * @returns The updated `Stream` record.
 * @throws {Error} If the authenticated user has no associated stream, or if
 * any part of the operation (authentication, lookup, or update) fails.
 */
export async function updateStream(values: Partial<Stream>): Promise<Stream> {
  try {
    const self = await getSelf();
    const selfStream = await db.stream.findUnique({
      where: {
        userId: self.id,
      },
    });

    if (!selfStream) {
      throw new Error("Stream not found");
    }

    const validData = {
      name: values.name,
      isChatEnabled: values.isChatEnabled,
      isChatFollowersOnly: values.isChatFollowersOnly,
      isChatDelayed: values.isChatDelayed,
    };

    const stream = await db.stream.update({
      where: {
        id: selfStream.id,
      },
      data: {
        ...validData,
      },
    });

    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);

    return stream;
  } catch {
    throw new Error("Internal Error");
  }
}
