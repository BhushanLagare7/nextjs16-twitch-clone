/**
 * @file components/stream-player/video.tsx
 * @description Resolves and renders the correct video state (offline,
 * loading, or live) for a stream host, plus the corresponding loading
 * skeleton.
 *
 * @module Video
 */

"use client";

import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";

import { Skeleton } from "@/components/ui/skeleton";

import { LiveVideo } from "./live-video";
import { LoadingVideo } from "./loading-video";
import { OfflineVideo } from "./offline-video";

/**
 * Props for the {@link Video} component.
 *
 * @interface VideoProps
 *
 * @property {string} hostName - Display name of the host, used by
 *   {@link OfflineVideo} when the host is not streaming.
 * @property {string} hostIdentity - LiveKit identity of the host, used to
 *   locate the corresponding remote participant and their tracks.
 */
interface VideoProps {
  hostName: string;
  hostIdentity: string;
}

/**
 * Determines and renders the appropriate video state for a host's stream:
 * offline, loading/connecting, or live.
 *
 * - Renders {@link OfflineVideo} when connected to the room but the host
 *   participant isn't present (stream not started).
 * - Renders {@link LoadingVideo} while the room connection or the host's
 *   tracks aren't yet available.
 * - Renders {@link LiveVideo} once the host participant and their tracks
 *   are available.
 *
 * @function Video
 *
 * @param {VideoProps} props - Component props.
 *
 * @returns {JSX.Element} The video state appropriate to the current
 *   connection and participant status.
 */
export function Video({ hostName, hostIdentity }: VideoProps) {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity);

  let content;

  if (!participant && connectionState === ConnectionState.Connected) {
    content = <OfflineVideo username={hostName} />;
  } else if (!participant || tracks.length === 0) {
    content = <LoadingVideo label={connectionState} />;
  } else {
    content = <LiveVideo participant={participant} />;
  }

  return <div className="group relative aspect-video border-b">{content}</div>;
}

/**
 * Placeholder shown in place of {@link Video} while the surrounding
 * `StreamPlayer` is still resolving a viewer token/connection.
 *
 * @function VideoSkeleton
 * @returns {JSX.Element} A full-bleed skeleton matching the video's
 *   aspect ratio.
 */
export function VideoSkeleton() {
  return (
    <div className="aspect-video border-x border-background">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
}
