/**
 * @file components/stream-player/chat-header.tsx
 * @description Header bar for the stream chat panel.
 *
 * Displays the panel title alongside the sidebar collapse toggle
 * ({@link ChatToggle}) and the chat/community variant toggle
 * ({@link VariantToggle}).
 *
 * @module ChatHeader
 */

"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { ChatToggle } from "./chat-toggle";
import { VariantToggle } from "./variant-toggle";

/**
 * Renders the chat panel header with a centered title, a collapse toggle
 * (visible on large screens only), and a chat/community variant toggle.
 *
 * @function ChatHeader
 * @returns {JSX.Element} The chat header UI.
 */
export function ChatHeader() {
  return (
    <div className="relative border-b p-3">
      <div className="absolute top-2 left-2 hidden lg:block">
        <ChatToggle />
      </div>
      <p className="text-priamry text-center font-semibold">Stream Chat</p>
      <div className="absolute top-2 right-2">
        <VariantToggle />
      </div>
    </div>
  );
}

/**
 * Loading placeholder for {@link ChatHeader}, shown on medium+ screens
 * while chat data is still being fetched.
 *
 * @function ChatHeaderSkeleton
 * @returns {JSX.Element} Skeleton UI mirroring the ChatHeader layout.
 */
export function ChatHeaderSkeleton() {
  return (
    <div className="relative hidden border-b p-3 md:block">
      <Skeleton className="absolute top-3 left-3 size-6" />
      <Skeleton className="mx-auto h-6 w-28" />
    </div>
  );
}
