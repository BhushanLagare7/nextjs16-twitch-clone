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

import { Stream, User } from "@/generated/prisma";
import { useViewerToken } from "@/hooks/use-viewer-token";

/**
 * Props for the {@link StreamPlayer} component.
 *
 * @interface StreamPlayerProps
 *
 * @property {User & { stream: Stream | null }} user - The Prisma `User`
 *   record of the stream host, including their nullable `stream` relation.
 *   The user's `id` is used to request a scoped viewer token.
 * @property {Stream} stream - The host's active `Stream` record. Contains
 *   stream metadata such as title and live status.
 * @property {boolean} isFollowing - Whether the current viewer follows the
 *   host. May be used to conditionally render follow-gated UI or features.
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

  return <div>Allowed to watch the stream</div>;
}
