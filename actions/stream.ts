/**
 * @file actions/stream.ts
 * @description Server actions for updating stream configuration and metadata.
 *
 * Provides mutations to update the authenticated user's stream settings,
 * including name, chat configurations, and thumbnail URL with domain validation.
 *
 * @module StreamActions
 */

"use server";

import { revalidatePath } from "next/cache";

import { Stream } from "@/generated/prisma";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

/**
 * Updates the stream settings (name, chat configuration, and thumbnail URL)
 * for the currently authenticated user's own stream.
 *
 * Only a fixed subset of fields (`name`, `isChatEnabled`, `isChatFollowersOnly`,
 * `isChatDelayed`, `thumbnailUrl`) is persisted. `thumbnailUrl` is validated to ensure
 * it is either `null` (removal) or an absolute HTTPS URL matching allowed UploadThing hosts.
 *
 * After a successful update, revalidates the cached paths for the user's
 * chat settings page, profile page, and public channel page so the UI
 * reflects the latest values.
 *
 * @param {Partial<Stream>} values - Partial stream fields to update.
 * @returns {Promise<Stream>} The updated `Stream` record.
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

    const validData: {
      name?: string;
      isChatEnabled?: boolean;
      isChatFollowersOnly?: boolean;
      isChatDelayed?: boolean;
      thumbnailUrl?: string | null;
    } = {
      name: values.name,
      isChatEnabled: values.isChatEnabled,
      isChatFollowersOnly: values.isChatFollowersOnly,
      isChatDelayed: values.isChatDelayed,
    };

    if (values.thumbnailUrl === null) {
      validData.thumbnailUrl = null;
    } else if (typeof values.thumbnailUrl === "string") {
      try {
        const parsed = new URL(values.thumbnailUrl);
        const isAllowedHost =
          parsed.protocol === "https:" &&
          (parsed.hostname === "utfs.io" ||
            parsed.hostname === "ufs.sh" ||
            parsed.hostname.endsWith(".ufs.sh"));
        if (isAllowedHost) {
          validData.thumbnailUrl = values.thumbnailUrl;
        }
      } catch {
        // Ignore invalid URL
      }
    }

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
