import type { Metadata } from "next";

import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

import { ToggleCard } from "./_components/toggle-card";

/**
 * Metadata for the chat settings dashboard page.
 */
export const metadata: Metadata = {
  title: "Chat Settings",
  description: "Configure chat permissions, slow mode, and follower-only chat for your stream.",
};

/**
 * Server-rendered page that lets the authenticated user configure chat
 * settings for their own stream: enabling/disabling chat, delaying chat
 * messages, and restricting chat to followers only.
 *
 * @throws {Error} If no stream exists for the authenticated user.
 */
export default async function ChatPage() {
  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    throw new Error("Stream not found");
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Chat settings</h1>
      </div>
      <div className="space-y-4">
        <ToggleCard
          field="isChatEnabled"
          label="Enable chat"
          value={stream.isChatEnabled}
        />
        <ToggleCard
          field="isChatDelayed"
          label="Delay chat"
          value={stream.isChatDelayed}
        />
        <ToggleCard
          field="isChatFollowersOnly"
          label="Must be following to chat"
          value={stream.isChatFollowersOnly}
        />
      </div>
    </div>
  );
}
