/**
 * @file components/stream-player/chat-community.tsx
 * @description "Community" tab of the chat sidebar. Lists all participants
 * currently connected to the stream room, with debounced search/filtering
 * and per-participant moderation actions (via {@link CommunityItem}).
 *
 * @module ChatCommunity
 */

"use client";

import { useMemo, useState } from "react";

import { useParticipants } from "@livekit/components-react";
import { type LocalParticipant, type RemoteParticipant } from "livekit-client";
import { useDebounceValue } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CommunityItem } from "./community-item";

/**
 * Props for the {@link ChatCommunity} component.
 *
 * @interface ChatCommunityProps
 *
 * @property {string} hostName - Display name of the stream host.
 * @property {string} viewerName - Display name of the current viewer.
 * @property {boolean} isHidden - Whether the community list is disabled
 *   (e.g. chat disabled/host offline), in which case a placeholder message
 *   is shown instead of the participant list.
 */
interface ChatCommunityProps {
  hostName: string;
  viewerName: string;
  isHidden: boolean;
}

/**
 * Renders a searchable list of stream participants.
 *
 * Deduplicates the host's identity, which may appear twice in the raw
 * participants list (once as the broadcasting identity, once prefixed as
 * `host-<identity>` if also connected as a viewer), and filters the
 * remaining participants by a debounced search query.
 *
 * @function ChatCommunity
 * @param {ChatCommunityProps} props - Component props.
 * @returns {JSX.Element} The community list UI, or a disabled placeholder.
 */
export function ChatCommunity({
  hostName,
  viewerName,
  isHidden,
}: ChatCommunityProps) {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue<string>(value, 500);

  const participants = useParticipants();

  /**
   * Deduplicated participants, filtered by the debounced search term
   * (case-insensitive match against participant name).
   *
   * Deduplication is done in a single linear pass: for each participant we
   * track the identities seen so far in a `Set` and skip a participant if
   * an entry named `host-<identity>` was already accepted earlier in the
   * list (i.e. the same person already appears under their "host-as-viewer"
   * identity). This preserves the original order-dependent behavior while
   * avoiding the `O(n^2)` cost of scanning the accumulator on every step.
   */
  const filteredParticipants = useMemo(() => {
    const seenIdentities = new Set<string>();
    const deduped: (RemoteParticipant | LocalParticipant)[] = [];

    for (const participant of participants) {
      const hostAsViewer = `host-${participant.identity}`;
      if (!seenIdentities.has(hostAsViewer)) {
        deduped.push(participant);
        seenIdentities.add(participant.identity);
      }
    }

    const lowerCaseQuery = debouncedValue.toLowerCase();

    return deduped.filter((participant) =>
      participant.name?.toLowerCase().includes(lowerCaseQuery),
    );
  }, [participants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Community is disabled</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Input
        className="border-white/10"
        placeholder="Search community"
        onChange={(e) => setValue(e.target.value)}
      />
      <ScrollArea className="mt-4 gap-y-2">
        <p className="hidden p-2 text-center text-sm text-muted-foreground last:block">
          No results
        </p>
        {filteredParticipants.map((participant) => (
          <CommunityItem
            key={participant.identity}
            hostName={hostName}
            participantIdentity={participant.identity}
            participantName={participant.name}
            viewerName={viewerName}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
