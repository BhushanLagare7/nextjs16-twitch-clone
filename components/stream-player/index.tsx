/**
 * @file components/stream-player/index.tsx
 * @description Client-side stream player component for viewing a LiveKit stream.
 *
 * Manages viewer token acquisition and conditionally renders the stream
 * view once a valid LiveKit JWT, identity, and display name are available.
 * Also exports {@link StreamPlayerSkeleton}, the corresponding loading state.
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
import { ChatSkeleton } from "./chat-message";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { InfoCard } from "./info-card";
import { Video, VideoSkeleton } from "./video";

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
 * and decode a scoped JWT. While the token is being retrieved, a
 * {@link StreamPlayerSkeleton} is displayed. If the request fails
 * permanently, an error message with a retry button is shown instead.
 *
 * Requires `NEXT_PUBLIC_LIVEKIT_WS_URL` to be set in the environment for
 * the `LiveKitRoom` to connect to the correct LiveKit server.
 *
 * @function StreamPlayer
 *
 * @param {StreamPlayerProps} props - Component props.
 *
 * @returns {JSX.Element} The stream player UI, a
 *   {@link StreamPlayerSkeleton} while loading, or an error/retry UI if
 *   a valid token, identity, or display name could not be obtained.
 *
 * @example
 * <StreamPlayer
 *   user={hostUser}
 *   stream={hostUser.stream}
 *   isFollowing={false}
 * />
 */
export function StreamPlayer({ user, stream, isFollowing }: StreamPlayerProps) {
  const { token, name, identity, isLoading, error } = useViewerToken(user.id);
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

  if (isLoading) {
    return <StreamPlayerSkeleton />;
  }

  if (error || !token || !name || !identity) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-4">
        <p className="text-sm text-muted-foreground">
          {error ?? "Unable to connect to stream"}
        </p>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
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
        <div
          className={cn(
            "hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5",
            collapsed && "2xl:col-span-2",
          )}
        >
          <Video hostIdentity={user.id} hostName={user.username} />
          <Header
            hostIdentity={user.id}
            hostName={user.username}
            imageUrl={user.imageUrl}
            isFollowing={isFollowing}
            name={stream.name}
            viewerIdentity={identity}
          />
          <InfoCard
            hostIdentity={user.id}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
            viewerIdentity={identity}
          />
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

/**
 * Loading state for {@link StreamPlayer}, rendered while the viewer token
 * is being fetched. Mirrors the real layout's grid structure with skeleton
 * placeholders for the video and chat panel.
 *
 * @function StreamPlayerSkeleton
 * @returns {JSX.Element} The stream player skeleton UI.
 */
export function StreamPlayerSkeleton() {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6">
      <div className="hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
}
