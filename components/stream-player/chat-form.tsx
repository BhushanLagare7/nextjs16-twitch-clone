/**
 * @file components/stream-player/chat-form.tsx
 * @description Message composer for the stream chat panel.
 *
 * Renders the chat input/submit UI and enforces client-side "slow mode"
 * throttling and followers-only gating before delegating to the parent's
 * `onSubmit` handler. Server-side enforcement of these rules is assumed to
 * happen independently; this component only prevents obviously invalid
 * submissions from being attempted.
 *
 * @module ChatForm
 */

"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { ChatInfo } from "./chat-info";

/**
 * Props for the {@link ChatForm} component.
 *
 * @interface ChatFormProps
 *
 * @property {() => void} onSubmit - Called once a message is ready to be
 *   sent (immediately, or after the slow-mode delay elapses).
 * @property {string} value - Controlled value of the chat input.
 * @property {(value: string) => void} onChange - Called whenever the input
 *   value changes.
 * @property {boolean} isHidden - Whether the entire form should be hidden
 *   (e.g. chat disabled or host offline).
 * @property {boolean} isFollowersOnly - Whether chat is restricted to
 *   followers of the host.
 * @property {boolean} isFollowing - Whether the current viewer follows the
 *   host. Combined with `isFollowersOnly` to determine input access.
 * @property {boolean} isDelayed - Whether "slow mode" is active, delaying
 *   message submission by a fixed interval.
 */
interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
}

/**
 * Renders the chat input form, including the contextual info banner
 * ({@link ChatInfo}), text input, and submit button.
 *
 * The form is disabled when chat is hidden, when a slow-mode delay is
 * currently pending, or when the viewer is not allowed to chat under
 * followers-only mode.
 *
 * @function ChatForm
 * @param {ChatFormProps} props - Component props.
 * @returns {JSX.Element | null} The chat form, or `null` when `isHidden` is true.
 */
export function ChatForm({
  onSubmit,
  value,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
}: ChatFormProps) {
  const [isDelayBlocked, setIsDelayBlocked] = useState(false);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled =
    isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;

  /**
   * Handles form submission.
   *
   * Ignores empty or disabled submissions. When slow mode is enabled,
   * blocks further submissions for 3 seconds before invoking `onSubmit`;
   * otherwise submits immediately.
   *
   * @param {React.SubmitEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isDelayed && !isDelayBlocked) {
      setIsDelayBlocked(true);
      delayTimerRef.current = setTimeout(() => {
        delayTimerRef.current = null;
        setIsDelayBlocked(false);
        onSubmit();
      }, 3000);
    } else {
      onSubmit();
    }
  };

  // Clear the pending delay timer when the form becomes disabled
  // (e.g. followers-only gate kicks in) to avoid a stale onSubmit firing.
  useEffect(() => {
    if (isDisabled && delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
      setIsDelayBlocked(false);
    }
  }, [isDisabled]);

  // Clean up the delay timer on unmount.
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <form
      className="flex flex-col items-center gap-y-4 p-3"
      onSubmit={handleSubmit}
    >
      <div className="w-full">
        <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />
        <Input
          className={cn(
            (isFollowersOnly || isDelayed) && "rounded-t-none border-t-0",
          )}
          disabled={isDisabled}
          placeholder="Send a message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="ml-auto">
        <Button disabled={isDisabled} size="sm" type="submit" variant="primary">
          Chat
        </Button>
      </div>
    </form>
  );
}

/**
 * Loading placeholder for {@link ChatForm}, shown while stream/session
 * data required to render the real form is still being fetched.
 *
 * @function ChatFormSkeleton
 * @returns {JSX.Element} Skeleton UI mirroring the ChatForm layout.
 */
export function ChatFormSkeleton() {
  return (
    <div className="flex flex-col items-center gap-y-4 p-3">
      <Skeleton className="h-10 w-full" />
      <div className="ml-auto flex items-center gap-x-2">
        <Skeleton className="size-7" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  );
}
