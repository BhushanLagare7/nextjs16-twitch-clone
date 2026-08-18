/**
 * @file components/stream-player/about-card.tsx
 * @description Displays the "About" section for a stream host's channel page.
 *
 * Shows the host's display name (with a verified badge), follower count,
 * and bio. When the current viewer is the host themselves, an inline
 * {@link BioModal} edit button is rendered so they can update their bio
 * without leaving the page.
 *
 * @module AboutCard
 */

"use client";

import { VerifiedMark } from "@/components/verified-mark";

import { BioModal } from "./bio-modal";

/**
 * Props for the {@link AboutCard} component.
 *
 * @interface AboutCardProps
 *
 * @property {string} hostName - The display name of the stream host,
 *   rendered in the card heading.
 * @property {string} hostIdentity - The LiveKit identity of the host,
 *   used to determine whether the current viewer is the host.
 * @property {string} viewerIdentity - The LiveKit identity of the current
 *   viewer, compared against the derived host identity to gate edit access.
 * @property {string | null} bio - The host's profile bio. When `null` or
 *   an empty string, a default placeholder message is displayed.
 * @property {number} followedByCount - The total number of users following
 *   the host, used to render the follower count with correct pluralisation.
 */
interface AboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  bio: string | null;
  followedByCount: number;
}

/**
 * Renders the "About" card for a stream host's channel page.
 *
 * The card displays:
 * - The host's name with a verified mark.
 * - Their follower count with correct singular/plural labelling.
 * - Their bio, or a mystery-themed fallback if no bio has been set.
 * - An edit button (via {@link BioModal}) shown only when the viewer
 *   is the channel owner.
 *
 * Host-vs-viewer detection is performed by comparing `viewerIdentity`
 * against the string `"host-{hostIdentity}"`, which is the LiveKit
 * identity format assigned to the host participant.
 *
 * @function AboutCard
 *
 * @param {AboutCardProps} props - Component props.
 *
 * @returns {JSX.Element} The about card UI.
 *
 * @example
 * <AboutCard
 *   hostName="Jane"
 *   hostIdentity="user_abc123"
 *   viewerIdentity="host-user_abc123"
 *   bio="Welcome to my channel!"
 *   followedByCount={42}
 * />
 */
export function AboutCard({
  hostName,
  hostIdentity,
  viewerIdentity,
  bio,
  followedByCount,
}: AboutCardProps) {
  /**
   * The expected LiveKit identity string for the host participant.
   * LiveKit identities for hosts are prefixed with `"host-"`.
   */
  const hostAsViewer = `host-${hostIdentity}`;

  /** Whether the current viewer is the channel owner. */
  const isHost = viewerIdentity === hostAsViewer;

  /** Pluralised follower label based on the follower count. */
  const followedByLabel = followedByCount === 1 ? "follower" : "followers";

  return (
    <div className="px-4">
      <div className="group flex flex-col gap-y-3 rounded-xl bg-background p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-lg font-semibold lg:text-2xl">
            About {hostName}
            <VerifiedMark />
          </div>
          {/* Only the host sees the edit button */}
          {isHost && <BioModal initialValue={bio} />}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">{followedByCount}</span>{" "}
          {followedByLabel}
        </div>
        {/* Render the host's bio or a default placeholder when unset / blank */}
        <p className="text-sm">
          {bio && bio.trim()
            ? bio
            : "This user prefers to keep an air of mystery about them."}
        </p>
      </div>
    </div>
  );
}
