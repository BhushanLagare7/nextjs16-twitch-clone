/**
 * @file components/stream-player/index.tsx
 * @description Client-side stream player component for viewing a LiveKit stream.
 *
 * Manages viewer token acquisition and conditionally renders the stream
 * view once a valid LiveKit JWT, identity, and display name are available.
 *
 * @module StreamPlayer
 */

"use client";

import { useCallback } from "react";

import { LiveKitRoom } from "@livekit/components-react";

import { Stream, User } from "@/generated/prisma";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";

import { Chat } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Video } from "./video";

/**
 * Props for the {@link StreamPlayer} component.
 *
 * @interface StreamPlayerProps
 *
 * @property {User & { stream: Stream | null }} user - The Prisma `User`
 *   record of the stream host, including their nullable `stream` relation.
 *   The user's `id` is used to request a scoped viewer token and as the
 *   LiveKit host identity, and `username` is used as the display label
 *   for the video.
 * @property {Stream} stream - The host's active `Stream` record. Its
 *   `isChatEnabled`, `isChatDelayed`, and `isChatFollowersOnly` flags are
 *   passed through to the {@link Chat} component to configure chat behavior.
 * @property {boolean} isFollowing - Whether the current viewer follows the
 *   host. Passed through to {@link Chat} for followers-only chat gating.
 */
interface StreamPlayerProps {
  user: User & { stream: Stream | null };
  stream: Stream;
  isFollowing: boolean;
}

/**
 * Renders a LiveKit-powered stream player for a given host's channel.
 *
 * Internally calls the {@link useViewerToken} hook to asynchronously fetch
 * and decode a scoped JWT. While the token is being retrieved, or if token
 * generation fails, a fallback message is displayed instead of the player.
 *
 * Requires `NEXT_PUBLIC_LIVEKIT_WS_URL` to be set in the environment for
 * the `LiveKitRoom` to connect to the correct LiveKit server.
 *
 * @function StreamPlayer
 *
 * @param {StreamPlayerProps} props - Component props.
 *
 * @returns {JSX.Element} The stream player UI, or a fallback error message
 *   if a valid token, identity, or display name could not be obtained.
 *
 * @example
 * <StreamPlayer
 *   user={hostUser}
 *   stream={hostUser.stream}
 *   isFollowing={false}
 * />
 */
export function StreamPlayer({ user, stream, isFollowing }: StreamPlayerProps) {
  const { token, name, identity } = useViewerToken(user.id);
  const { collapsed } = useChatSidebar((state) => state);

  /**
   * Handles LiveKit connection errors gracefully.
   *
   * These errors commonly occur during page navigation when the WebSocket
   * connection is torn down mid-flight ("cannot send signal request before
   * connected" / "websocket error during connection establishment"). They
   * are benign cleanup race conditions and are logged at debug level.
   */
  const onError = useCallback((error: Error) => {
    console.debug(
      "[LiveKitRoom] Connection error (likely navigation teardown):",
      error.message,
    );
  }, []);

  /** Handles clean disconnection from the LiveKit room. */
  const onDisconnected = useCallback(() => {
    console.debug("[LiveKitRoom] Disconnected");
  }, []);

  // Token, identity, or name missing — either still loading or an error occurred.
  if (!token || !name || !identity) {
    return <div>Cannot watch the stream</div>;
  }

  return (
    <>
      {collapsed && (
        <div className="fixed top-25 right-2 z-50 hidden lg:block">
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        className={cn(
          "grid h-full grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2",
        )}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        token={token}
        onDisconnected={onDisconnected}
        onError={onError}
      >
        <div className={cn(
          "hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5",
          collapsed && "2xl:col-span-2",
        )}>
          <Video hostIdentity={user.id} hostName={user.username} />
        </div>
        <div className={cn("col-span-1", collapsed && "hidden")}>
          <Chat
            hostIdentity={user.id}
            hostName={user.username}
            isChatDelayed={stream.isChatDelayed}
            isChatEnabled={stream.isChatEnabled}
            isChatFollowersOnly={stream.isChatFollowersOnly}
            isFollowing={isFollowing}
            viewerName={name}
          />
        </div>
      </LiveKitRoom>
    </>
  );
}
