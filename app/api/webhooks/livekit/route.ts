import { headers } from "next/headers";

import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";

/**
 * LiveKit API credentials used to verify webhook signatures.
 * These must be present in the environment for the module to load.
 */
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set in the environment variables",
  );
}

/**
 * Shared WebhookReceiver instance used to validate the authenticity
 * of incoming LiveKit webhook payloads and parse them into events.
 */
const receiver = new WebhookReceiver(apiKey, apiSecret);

/**
 * Updates the "isLive" status of the stream associated with the given
 * LiveKit ingress ID.
 *
 * @param ingressId - The ingress ID reported by the LiveKit event
 *   (may be `undefined` if not provided by LiveKit).
 * @param isLive - Whether the stream should be marked as live.
 */
async function setStreamLiveStatus(
  ingressId: string | undefined,
  isLive: boolean,
): Promise<void> {
  if (!ingressId) return;

  const { count } = await db.stream.updateMany({
    where: { ingressId },
    data: { isLive },
  });

  if (count === 0) {
    console.warn(
      `No stream found for ingressId "${ingressId}"; event ignored.`,
    );
  }
}

/**
 * Handles incoming LiveKit webhook POST requests.
 *
 * Verifies the request's "Authorization" header against the raw request
 * body using the LiveKit `WebhookReceiver`, then reacts to ingress
 * lifecycle events by updating the corresponding stream's live status:
 *
 * - `ingress_started` → marks the stream as live.
 * - `ingress_ended` → marks the stream as no longer live.
 *
 * @param req - The incoming webhook request sent by LiveKit.
 * @returns
 *  - `400` if the "Authorization" header is missing.
 *  - `500` if signature verification or event processing fails.
 *  - `200` with body "OK" on successful processing.
 */
export async function POST(req: Request): Promise<Response> {
  const body = await req.text();
  const headerPayload = await headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  try {
    const event = await receiver.receive(body, authorization);
    const ingressId = event.ingressInfo?.ingressId;

    switch (event.event) {
      case "ingress_started":
        await setStreamLiveStatus(ingressId, true);
        break;
      case "ingress_ended":
        await setStreamLiveStatus(ingressId, false);
        break;
      default:
        // No action required for other event types.
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Failed to process LiveKit webhook:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
