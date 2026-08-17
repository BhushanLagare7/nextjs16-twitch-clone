/**
 * @file components/stream-player/header.tsx
 * @description Stream channel header displaying host info, live status,
 * viewer count, and follow/unfollow controls.
 *
 * Uses LiveKit participant hooks to derive live status and viewer count
 * in real time. Also exports {@link HeaderSkeleton}, the corresponding
 * loading state.
 *
 * @module Header
 */

"use client";

import {
  useParticipants,
  useRemoteParticipant,
} from "@livekit/components-react";
import { UserIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { VerifiedMark } from "@/components/verified-mark";

import { Actions, ActionsSkeleton } from "./actions";

/**
 * Props for the {@link Header} component.
 *
 * @interface HeaderProps
 *
 * @property {string} imageUrl - URL of the host's profile image, passed
 *   to {@link UserAvatar}.
 * @property {string} hostName - Display username of the stream host, shown
 *   as the channel heading and passed to {@link UserAvatar}.
 * @property {string} hostIdentity - The unique LiveKit identity of the host
 *   participant, used to determine live status via {@link useRemoteParticipant}
 *   and passed to {@link Actions}.
 * @property {string} viewerIdentity - The current viewer's LiveKit identity.
 *   Compared against the host's prefixed identity (`host-{hostIdentity}`)
 *   to determine whether the viewer is the host.
 * @property {boolean} isFollowing - Whether the current viewer follows the
 *   host. Passed through to {@link Actions} for follow state rendering.
 * @property {string} name - The stream's display name (title), rendered
 *   below the host's username.
 */
interface HeaderProps {
  imageUrl: string;
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  isFollowing: boolean;
  name: string;
}

/**
 * Renders the stream channel header with host info, live/offline status,
 * viewer count, and a follow/unfollow button.
 *
 * - **Live status** is derived from the presence of the host as a remote
 *   LiveKit participant (`useRemoteParticipant`). If the host participant
 *   exists, the stream is considered live.
 * - **Viewer count** is the total LiveKit participant count minus one
 *   (excluding the host), obtained via `useParticipants`.
 * - **Host detection** compares `viewerIdentity` against the host's
 *   prefixed identity (`host-{hostIdentity}`) to disable self-follow.
 *
 * Must be rendered inside a `LiveKitRoom` context so the LiveKit hooks
 * can access the active room state.
 *
 * @function Header
 *
 * @param {HeaderProps} props - Component props.
 *
 * @returns {JSX.Element} The stream header UI containing the host avatar,
 *   username, verified mark, stream name, live/viewer info or offline
 *   label, and the follow/unfollow {@link Actions} button.
 *
 * @example
 * <Header
 *   imageUrl="https://example.com/avatar.jpg"
 *   hostName="streamer42"
 *   hostIdentity="user_abc123"
 *   viewerIdentity="user_xyz789"
 *   isFollowing={true}
 *   name="My Awesome Stream"
 * />
 */
export function Header({
  imageUrl,
  hostName,
  hostIdentity,
  viewerIdentity,
  isFollowing,
  name,
}: HeaderProps) {
  /** All current participants in the LiveKit room, including the local user. */
  const participants = useParticipants();

  /** The host's remote participant record, or `undefined` if the host is offline. */
  const participant = useRemoteParticipant(hostIdentity);

  /** `true` if the host is present as a remote participant (i.e., actively streaming). */
  const isLive = !!participant;

  /** Number of viewers: total participants minus the host. */
  const participantCount = participants.length - 1;

  /**
   * The prefixed identity used when a host joins the room as a viewer of
   * their own stream. Used to detect whether the current viewer is the host.
   */
  const hostAsViewer = `host-${hostIdentity}`;

  /** `true` if the current viewer's identity matches the host's viewer-role identity. */
  const isHost = viewerIdentity === hostAsViewer;

  return (
    <div className="flex flex-col items-start justify-between gap-y-4 px-4 lg:flex-row lg:gap-y-0">
      <div className="flex items-center gap-x-3">
        <UserAvatar
          imageUrl={imageUrl}
          isLive={isLive}
          showBadge
          size="lg"
          username={hostName}
        />
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-semibold">{hostName}</h2>
            <VerifiedMark />
          </div>
          <p className="text-sm font-semibold">{name}</p>
          {isLive ? (
            <div className="flex items-center gap-x-1 text-xs font-semibold text-rose-500">
              <UserIcon className="size-4" />
              <p>
                {participantCount}{" "}
                {participantCount === 1 ? "viewer" : "viewers"}
              </p>
            </div>
          ) : (
            <p className="text-xs font-semibold text-muted-foreground">
              Offline
            </p>
          )}
        </div>
      </div>
      <Actions
        hostIdentity={hostIdentity}
        isFollowing={isFollowing}
        isHost={isHost}
      />
    </div>
  );
}

/**
 * Loading state for {@link Header}, rendered while host data or participant
 * info is being resolved. Mirrors the real header layout with skeleton
 * placeholders for the avatar, username, stream name, and actions button.
 *
 * @function HeaderSkeleton
 * @returns {JSX.Element} The stream header skeleton UI.
 */
export function HeaderSkeleton() {
  return (
    <div className="flex flex-col items-start justify-between gap-y-4 px-4 lg:flex-row lg:gap-y-0">
      <div className="flex items-center gap-x-2">
        <UserAvatarSkeleton size="lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <ActionsSkeleton />
    </div>
  );
}
