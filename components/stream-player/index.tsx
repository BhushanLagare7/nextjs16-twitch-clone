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

import { LiveKitRoom } from "@livekit/components-react";

import { Stream, User } from "@/generated/prisma";
import { useViewerToken } from "@/hooks/use-viewer-token";

import { Video } from "./video";

/**
 * Props for the {@link StreamPlayer} component.
 *
 * @interface StreamPlayerProps
 *
 * @property {User & { stream: Stream | null }} user - The Prisma `User`
 *   record of the stream host, including their nullable `stream` relation.
 *   The user's `id` is used to request a scoped viewer token, and
 *   `username` is used as the display label for the video.
 * @property {Stream} stream - The host's active `Stream` record. Currently
 *   accepted for future use (e.g. rendering stream metadata) but not yet
 *   consumed within this component.
 * @property {boolean} isFollowing - Whether the current viewer follows the
 *   host. Currently accepted for future use (e.g. follow-gated UI) but not
 *   yet consumed within this component.
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

  // Token, identity, or name missing — either still loading or an error occurred.
  if (!token || !name || !identity) {
    return <div>Cannot watch the stream</div>;
  }

  return (
    <>
      <LiveKitRoom
        className="grid h-full grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        token={token}
      >
        <div className="hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5">
          <Video hostIdentity={user.id} hostName={user.username} />
        </div>
      </LiveKitRoom>
    </>
  );
}
