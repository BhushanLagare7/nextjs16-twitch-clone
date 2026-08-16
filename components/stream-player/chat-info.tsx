/**
 * @file components/stream-player/chat-info.tsx
 * @description Contextual info banner shown above the chat input,
 * indicating active chat restrictions (followers-only and/or slow mode).
 *
 * @module ChatInfo
 */

import { useMemo } from "react";

import { InfoIcon } from "lucide-react";

import { Hint } from "@/components/hint";

/**
 * Props for the {@link ChatInfo} component.
 *
 * @interface ChatInfoProps
 *
 * @property {boolean} isDelayed - Whether "slow mode" is enabled.
 * @property {boolean} isFollowersOnly - Whether chat is restricted to
 *   followers of the host.
 */
interface ChatInfoProps {
  isDelayed: boolean;
  isFollowersOnly: boolean;
}

/**
 * Renders a small banner above the chat input describing which chat
 * restrictions are currently active (followers-only, slow mode, or both).
 * Renders nothing when no restrictions apply.
 *
 * @function ChatInfo
 * @param {ChatInfoProps} props - Component props.
 * @returns {JSX.Element | null} The info banner, or `null` when neither
 *   restriction is active.
 */
export function ChatInfo({ isDelayed, isFollowersOnly }: ChatInfoProps) {
  // Full hint text shown on hover, describing active restriction(s).
  const hint = useMemo(() => {
    if (isFollowersOnly && !isDelayed) {
      return "Only followers can chat";
    }

    if (isDelayed && !isFollowersOnly) {
      return "Messages are delayed by 3 seconds";
    }

    if (isDelayed && isFollowersOnly) {
      return "Only followers can chat. Messages are delayed by 3 seconds";
    }

    return "";
  }, [isDelayed, isFollowersOnly]);

  // Short label displayed inline in the banner.
  const label = useMemo(() => {
    if (isFollowersOnly && !isDelayed) {
      return "Followers only";
    }

    if (isDelayed && !isFollowersOnly) {
      return "Slow mode";
    }

    if (isDelayed && isFollowersOnly) {
      return "Followers only and slow mode";
    }

    return "";
  }, [isDelayed, isFollowersOnly]);

  if (!isDelayed && !isFollowersOnly) {
    return null;
  }

  return (
    <div className="flex w-full items-center gap-x-2 rounded-t-md border border-border bg-muted/40 p-2 text-muted-foreground">
      <Hint label={hint}>
        <InfoIcon className="size-4" />
      </Hint>
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}
