/**
 * @file components/stream-player/chat.tsx
 * @description Top-level stream chat panel.
 *
 * Composes the header, message list, and input form, wires them to
 * LiveKit's `useChat` hook for sending/receiving messages, and
 * auto-collapses the chat sidebar on smaller viewports.
 *
 * @module Chat
 */

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useMediaQuery } from "usehooks-ts";

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatForm } from "./chat-form";
import { ChatHeader } from "./chat-header";
import { ChatList } from "./chat-list";

/**
 * Props for the {@link Chat} component.
 *
 * @interface ChatProps
 *
 * @property {string} hostName - Display name of the stream host.
 * @property {string} hostIdentity - LiveKit identity (user id) of the host,
 *   used to look up their remote participant/online status.
 * @property {string} viewerName - Display name of the current viewer.
 * @property {boolean} isFollowing - Whether the current viewer follows the
 *   host; used for followers-only chat gating.
 * @property {boolean} isChatEnabled - Whether chat is enabled for the stream.
 * @property {boolean} isChatDelayed - Whether "slow mode" is enabled.
 * @property {boolean} isChatFollowersOnly - Whether chat is restricted to
 *   followers only.
 */
interface ChatProps {
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}

/**
 * Renders the stream chat panel, switching between the "chat" and
 * "community" variants based on the shared {@link useChatSidebar} store.
 *
 * The chat is considered hidden (read-only welcome/disabled message) when
 * chat is disabled or the host is not currently online. On viewports
 * narrower than 1024px, the sidebar is forced into its collapsed state.
 *
 * @function Chat
 * @param {ChatProps} props - Component props.
 * @returns {JSX.Element} The chat panel UI.
 */
export function Chat({
  hostName,
  hostIdentity,
  viewerName,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
}: ChatProps) {
  const matches = useMediaQuery("(max-width: 1024px)");
  const { variant, onExpand } = useChatSidebar((state) => state);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;

  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();

  // Force-expand (i.e. reset collapsed state) whenever the viewport
  // drops below the small-screen breakpoint.
  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [matches, onExpand]);

  // Sort messages newest-first for use with the column-reverse ChatList.
  const reversedMessages = useMemo(() => {
    return [...messages].sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  /** Sends the current input value via LiveKit and clears the input. */
  const onSubmit = async () => {
    if (!send) return;

    try {
      await send(value);
      setValue("");
    } catch (error) {
      console.error("[Chat] Failed to send message:", error);
    }
  };

  /** Updates the controlled chat input value. */
  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col border-b border-l bg-background pt-0">
      <ChatHeader />
      {variant === ChatVariant.CHAT && (
        <>
          <ChatList isHidden={isHidden} messages={reversedMessages} />
          <ChatForm
            isDelayed={isChatDelayed}
            isFollowersOnly={isChatFollowersOnly}
            isFollowing={isFollowing}
            isHidden={isHidden}
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </>
      )}
      {variant === ChatVariant.COMMUNITY && (
        <>
          <p>Community</p>
        </>
      )}
    </div>
  );
}
