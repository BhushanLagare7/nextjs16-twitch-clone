import { NextRequest } from "next/server";

import type { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { resetIngresses } from "@/actions/ingress";
import { db } from "@/lib/db";

/**
 * The subset of a Clerk user webhook payload required to derive the local
 * database representation of a user.
 */
interface ClerkUserPayload {
  id: string;
  username: string | null;
  image_url: string;
}

/**
 * Maps a Clerk user payload (from `user.created` or `user.updated` events)
 * to the local database fields.
 *
 * Falls back to the Clerk user ID as the username when no username is set
 * (`null` or `undefined`).
 *
 * @param data - The relevant fields from the Clerk webhook payload.
 * @returns An object containing the `username` and `imageUrl` fields to persist.
 */
function buildUserData(data: ClerkUserPayload) {
  return {
    username: data.username ?? data.id,
    imageUrl: data.image_url,
  };
}

/**
 * Handles incoming Clerk webhook events for user lifecycle synchronisation.
 *
 * Verifies the authenticity of the incoming request using Clerk's
 * `verifyWebhook` utility, then applies the corresponding database mutation
 * based on the event type:
 *
 * - `user.created` — Upserts the local user record (create if absent,
 *   otherwise update), guarding against duplicate deliveries of the same
 *   event (Clerk webhooks are delivered at least once).
 * - `user.updated` — Updates the corresponding local user record, if any.
 * - `user.deleted` — Deletes the corresponding local user record, if any.
 *
 * Any other event type is accepted (200) but ignored, matching Clerk's
 * expectation that unhandled event types should not cause failures.
 *
 * @param req - The incoming Next.js request containing the Clerk webhook payload.
 * @returns A `Response`:
 *  - `200` — Webhook verified and processed (including no-op for unhandled types).
 *  - `400` — Webhook verification failed, a database operation failed, or
 *            (for `user.deleted`) the payload was missing a user ID.
 */
export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;

    switch (evt.type) {
      case "user.created": {
        const data = buildUserData(evt.data);

        await db.user.upsert({
          where: {
            externalUserId: evt.data.id,
          },
          create: {
            externalUserId: evt.data.id,
            ...data,
            stream: {
              create: {
                name: `${data.username}'s stream`,
              },
            },
          },
          update: data,
        });
        break;
      }

      case "user.updated": {
        await db.user.updateMany({
          where: {
            externalUserId: evt.data.id,
          },
          data: buildUserData(evt.data),
        });
        break;
      }

      case "user.deleted": {
        if (!evt.data.id) {
          return new Response("Missing user ID in payload", { status: 400 });
        }

        // Best-effort cleanup of LiveKit resources. Ignore not-found errors
        // from LiveKit (e.g. room/ingress already deleted in a previous
        // delivery), since Clerk webhooks are at-least-once and retries
        // may re-deliver after resources are already gone. Other errors
        // still propagate to avoid silently masking real failures.
        try {
          await resetIngresses(evt.data.id);
        } catch (error) {
          const isNotFound =
            error instanceof Error &&
            /not\s*found/i.test(error.message);
          if (!isNotFound) {
            throw error;
          }
        }

        await db.user.deleteMany({
          where: {
            externalUserId: evt.data.id,
          },
        });
        break;
      }

      default:
        // Unhandled event types are intentionally ignored.
        break;
    }

    return new Response("Webhook received and processed", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
