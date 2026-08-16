/**
 * @file components/stream-player/community-item.tsx
 * @description A single row in the {@link ChatCommunity} participant list,
 * showing the participant's color-coded name and, for hosts, a "block"
 * action.
 *
 * @module CommunityItem
 */

"use client";

import { useTransition } from "react";

import { MinusCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { onBlock } from "@/actions/block";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn, stringToColor } from "@/lib/utils";

/**
 * Props for the {@link CommunityItem} component.
 *
 * @interface CommunityItemProps
 *
 * @property {string} hostName - Display name of the stream host, used to
 *   determine whether the current viewer has host/moderation privileges.
 * @property {string} viewerName - Display name of the current viewer.
 * @property {string} [participantName] - Display name of the participant
 *   represented by this row. May be undefined if not yet set by LiveKit.
 * @property {string} participantIdentity - LiveKit identity of the
 *   participant, passed to {@link onBlock} when blocking.
 */
interface CommunityItemProps {
  hostName: string;
  viewerName: string;
  participantName?: string;
  participantIdentity: string;
}

/**
 * Renders a single participant row with a deterministically color-coded
 * name (via {@link stringToColor}). If the current viewer is the host and
 * the row isn't the host's own entry, a "Block" action is shown that
 * blocks the participant via the {@link onBlock} server action.
 *
 * @function CommunityItem
 * @param {CommunityItemProps} props - Component props.
 * @returns {JSX.Element} The rendered participant row.
 */
export function CommunityItem({
  hostName,
  viewerName,
  participantIdentity,
  participantName,
}: CommunityItemProps) {
  const [isPending, startTransition] = useTransition();

  const color = stringToColor(participantName ?? "");
  const isSelf = participantName === viewerName;
  const isHost = viewerName === hostName;

  /**
   * Blocks the participant via the `onBlock` server action, guarded so
   * only the host can block others (and never themselves).
   */
  const handleBlock = () => {
    if (!participantName || isSelf || !isHost) return;

    startTransition(async () => {
      try {
        await onBlock(participantIdentity);
        toast.success(`Blocked ${participantName}`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div
      className={cn(
        "group flex w-full items-center justify-between rounded-md p-2 text-sm hover:bg-muted/50",
        isPending && "pointer-events-none opacity-50",
      )}
    >
      <p style={{ color: color }}>{participantName}</p>
      {isHost && !isSelf && (
        <Hint label="Block">
          <Button
            className="h-auto w-auto p-1 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
            disabled={isPending}
            variant="ghost"
            onClick={handleBlock}
          >
            <MinusCircleIcon className="size-4 text-muted-foreground" />
          </Button>
        </Hint>
      )}
    </div>
  );
}
