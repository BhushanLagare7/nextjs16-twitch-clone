import { NextRequest } from "next/server";

import type { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { db } from "@/lib/db";

/**
 * Handles incoming Clerk webhook events for user lifecycle synchronisation.
 *
 * Verifies the authenticity of the incoming request using Clerk's
 * `verifyWebhook` utility, then applies the corresponding database mutation
 * based on the event type:
 *
 * - `user.created` — Creates a new local user record.
 * - `user.updated` — Updates the corresponding local user record.
 * - `user.deleted` — Deletes the corresponding local user record.
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
        await db.user.create({
          data: {
            externalUserId: evt.data.id,
            username: evt.data.username ?? evt.data.id,
            imageUrl: evt.data.image_url,
          },
        });
        break;
      }

      case "user.updated": {
        await db.user.update({
          where: {
            externalUserId: evt.data.id,
          },
          data: {
            username: evt.data.username ?? evt.data.id,
            imageUrl: evt.data.image_url,
          },
        });
        break;
      }

      case "user.deleted": {
        if (!evt.data.id) {
          return new Response("Missing user ID in payload", { status: 400 });
        }

        await db.user.delete({
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
