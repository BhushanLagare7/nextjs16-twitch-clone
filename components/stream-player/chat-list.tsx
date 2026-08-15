/**
 * @file components/stream-player/chat-list.tsx
 * @description Scrollable list of received chat messages, rendered newest
 * message closest to the input via a column-reverse layout, plus its
 * loading skeleton.
 *
 * @module ChatList
 */

"use client";

import { ReceivedChatMessage } from "@livekit/components-react";

import { Skeleton } from "../ui/skeleton";

import { ChatMessage } from "./chat-message";

/**
 * Props for the {@link ChatList} component.
 *
 * @interface ChatListProps
 *
 * @property {ReceivedChatMessage[]} messages - Chat messages to render,
 *   expected to already be sorted newest-first.
 * @property {boolean} isHidden - Whether chat is disabled, in which case
 *   an explanatory placeholder is shown instead of the message list.
 */
interface ChatListProps {
  messages: ReceivedChatMessage[];
  isHidden: boolean;
}

/**
 * Renders the list of chat messages, or a placeholder when chat is hidden
 * or there are no messages yet.
 *
 * @function ChatList
 * @param {ChatListProps} props - Component props.
 * @returns {JSX.Element} The chat message list or a placeholder message.
 */
export function ChatList({ messages, isHidden }: ChatListProps) {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col-reverse overflow-y-auto p-3">
      {messages.map((message) => (
        <ChatMessage key={message.timestamp} data={message} />
      ))}
    </div>
  );
}

/**
 * Placeholder shown in place of {@link ChatList} while chat data/state is
 * still loading.
 *
 * @function ChatListSkeleton
 * @returns {JSX.Element} A centered skeleton bar.
 */
export function ChatListSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="h-6 w-1/2" />
    </div>
  );
}
