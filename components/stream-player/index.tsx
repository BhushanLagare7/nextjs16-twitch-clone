/**
 * @file components/stream-player/index.tsx
 * @description Client-side stream player component for viewing a LiveKit stream.
 *
 * Manages viewer token acquisition and conditionally renders the full stream
 * view once a valid LiveKit JWT, identity, and display name are available.
 * Displays a {@link StreamPlayerSkeleton} while the token is loading, and an
 * error message with a retry button if the token request fails permanently.
 *
 * Also exports {@link StreamPlayerSkeleton}, the corresponding loading state
 * used as a `<Suspense>` fallback on the channel page.
 *
 * @module StreamPlayer
 */

"use client";

import { useCallback } from "react";

import { LiveKitRoom } from "@livekit/components-react";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";

import { AboutCard } from "./about-card";
import { Chat } from "./chat";
import { ChatSkeleton } from "./chat-message";
import { ChatToggle } from "./chat-toggle";
import { Header, HeaderSkeleton } from "./header";
import { InfoCard } from "./info-card";
import { Video, VideoSkeleton } from "./video";

/**
 * A minimal stream record containing only the fields consumed by
 * {@link StreamPlayer}, decoupled from the full Prisma `Stream` model.
 *
 * @typedef {object} CustomStream
 * @property {string}      id                   - Unique stream identifier.
 * @property {boolean}     isChatEnabled        - Whether chat is enabled for the stream.
 * @property {boolean}     isChatDelayed        - Whether chat messages are delayed.
 * @property {boolean}     isChatFollowersOnly  - Whether chat is restricted to followers.
 * @property {boolean}     isLive               - Whether the stream is currently live.
 * @property {string|null} thumbnailUrl         - URL of the stream's thumbnail image,
 *                                                or `null` if not set.
 * @property {string}      name                 - Display name / title of the stream.
 */
type CustomStream = {
  id: string;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  isLive: boolean;
  thumbnailUrl: string | null;
  name: string;
};

/**
 * A minimal user record containing only the fields consumed by
 * {@link StreamPlayer}, decoupled from the full Prisma `User` model.
 *
 * @typedef {object} CustomUser
 * @property {string}            id            - Unique user identifier. Used to
 *                                               request a scoped viewer token and as
 *                                               the LiveKit host identity.
 * @property {string}            username      - The streamer's display name.
 * @property {string|null}       bio           - The streamer's biography text,
 *                                               or `null` if not set.
 * @property {CustomStream|null} stream        - The streamer's active stream record,
 *                                               or `null` if no stream exists.
 * @property {string}            imageUrl      - URL of the streamer's profile image.
 * @property {{ followedBy: number }} _count   - Aggregated relation counts.
 *   - `followedBy` — total number of users following the streamer, passed to
 *     {@link AboutCard} for the follower count display.
 */
type CustomUser = {
  id: string;
  username: string;
  bio: string | null;
  stream: CustomStream | null;
  imageUrl: string;
  _count: { followedBy: number };
};

/**
 * Props for the {@link StreamPlayer} component.
 *
 * @interface StreamPlayerProps
 * @property {CustomUser}   user        - The stream host's user record. The `id`
 *                                        is used to request a scoped viewer token;
 *                                        `username` is used as the channel display label.
 * @property {CustomStream} stream      - The host's active stream record. Chat
 *                                        configuration flags (`isChatEnabled`,
 *                                        `isChatDelayed`, `isChatFollowersOnly`) are
 *                                        forwarded to the {@link Chat} component.
 * @property {boolean}      isFollowing - Whether the current viewer follows the host.
 *                                        Forwarded to {@link Chat} for followers-only
 *                                        chat access gating.
 */
interface StreamPlayerProps {
  stream: CustomStream;
  user: CustomUser;
  isFollowing: boolean;
}

/**
 * Renders a LiveKit-powered stream player for a given host's channel.
 *
 * Internally calls the {@link useViewerToken} hook to asynchronously fetch
 * and decode a scoped JWT for the current viewer. While the token is being
 * retrieved, a {@link StreamPlayerSkeleton} is displayed. If the request
 * fails permanently, an error message with a retry button is rendered.
 *
 * Once a valid token, identity, and display name are available, the component
 * renders a `LiveKitRoom` containing:
 * - {@link Video} — the main stream video track.
 * - {@link Header} — stream title, host info, and follow button.
 * - {@link InfoCard} — editable stream metadata (host-only).
 * - {@link AboutCard} — host bio and follower count.
 * - {@link Chat} — real-time chat panel with configurable access rules.
 * - {@link ChatToggle} — button to collapse/expand the chat sidebar.
 *
 * Requires `NEXT_PUBLIC_LIVEKIT_WS_URL` to be defined in the environment
 * for `LiveKitRoom` to connect to the correct LiveKit server instance.
 *
 * @param {StreamPlayerProps} props              - Component props.
 * @param {CustomUser}        props.user         - The stream host's user data.
 * @param {CustomStream}      props.stream       - The host's active stream data.
 * @param {boolean}           props.isFollowing  - Whether the viewer follows the host.
 * @returns {JSX.Element} The full stream player UI, a {@link StreamPlayerSkeleton}
 *   while loading, or an error/retry UI if a valid token could not be obtained.
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
   * connection is torn down mid-flight (e.g. "cannot send signal request
   * before connected" / "websocket error during connection establishment").
   * They are benign cleanup race conditions and are logged at debug level
   * to avoid noise in production error monitors.
   *
   * @param {Error} error - The error emitted by the LiveKit room.
   */
  const onError = useCallback((error: Error) => {
    console.debug(
      "[LiveKitRoom] Connection error (likely navigation teardown):",
      error.message,
    );
  }, []);

  /**
   * Handles clean disconnection from the LiveKit room.
   * Logged at debug level for development diagnostics.
   */
  const onDisconnected = useCallback(() => {
    console.debug("[LiveKitRoom] Disconnected");
  }, []);

  /* Render the skeleton while the viewer token is being fetched */
  if (isLoading) {
    return <StreamPlayerSkeleton />;
  }

  /* Render an error state if the token request failed or returned incomplete data */
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
      {/* ChatToggle is fixed top-right and only visible on large screens
          when the chat sidebar is collapsed */}
      {collapsed && (
        <div className="fixed top-25 right-2 z-50 hidden lg:block">
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        className={cn(
          "grid h-full grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6",
          /* Shrink the grid when the sidebar is collapsed */
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2",
        )}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        token={token}
        onDisconnected={onDisconnected}
        onError={onError}
      >
        {/* Main content column: video feed, stream header, info, and about cards */}
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
          <AboutCard
            bio={user.bio}
            followedByCount={user._count.followedBy}
            hostIdentity={user.id}
            hostName={user.username}
            viewerIdentity={identity}
          />
        </div>

        {/* Chat sidebar column — hidden entirely when collapsed */}
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
 * StreamPlayerSkeleton component - Loading placeholder for {@link StreamPlayer}.
 *
 * Rendered while the viewer token is being fetched by {@link useViewerToken}.
 * Mirrors the real layout's responsive grid structure with skeleton
 * placeholders for the video feed ({@link VideoSkeleton}), stream header
 * ({@link HeaderSkeleton}), and chat panel ({@link ChatSkeleton}).
 *
 * @returns {JSX.Element} The stream player skeleton UI.
 *
 * @example
 * <StreamPlayerSkeleton />
 */
export function StreamPlayerSkeleton() {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6">
      {/* Main content skeleton: video and header placeholders */}
      <div className="hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>

      {/* Chat panel skeleton */}
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
}
