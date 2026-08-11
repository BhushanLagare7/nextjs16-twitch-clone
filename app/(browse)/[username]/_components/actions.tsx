/**
 * @file app/(browse)/[username]/_components/actions.tsx
 * @description Client-side follow/unfollow and block action component for
 * user profile pages.
 *
 * Renders two buttons:
 * - A follow/unfollow toggle that switches the follow relationship between
 *   the authenticated user and the target user.
 * - A block button that permanently blocks the target user.
 *
 * Uses React's `useTransition` hook to track pending server action states
 * and displays toast notifications on success or failure.
 *
 * @module Actions
 */

"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { onBlock } from "@/actions/block";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";

/**
 * Props for the Actions component.
 *
 * @interface ActionsProps
 * @property {boolean} isFollowing - Whether the current user already follows
 *   the target user. Determines the initial button label and action.
 * @property {string} userId - The unique identifier of the target user
 *   to follow, unfollow, or block.
 */
interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

/**
 * Actions component — renders follow/unfollow and block buttons for a
 * user profile page.
 *
 * Manages asynchronous follow, unfollow, and block server action calls
 * within a shared React transition to avoid blocking the UI. Displays a
 * success toast with the relevant username on completion, or an error toast
 * if any action fails.
 *
 * All buttons are disabled while a transition is in progress to prevent
 * duplicate or concurrent submissions.
 *
 * @component
 * @param {ActionsProps} props - The component props.
 * @param {boolean} props.isFollowing - Current follow state for the target user.
 * @param {string} props.userId - ID of the user to follow, unfollow, or block.
 *
 * @returns {JSX.Element} Follow/unfollow and block buttons with pending state
 *   handling.
 *
 * @example
 * <Actions isFollowing={false} userId="user_abc123" />
 */
export function Actions({ isFollowing, userId }: ActionsProps) {
  /**
   * `isPending` — true while any server action (follow, unfollow, or block)
   * is in flight.
   * `startTransition` — wraps async actions to mark them as non-urgent updates,
   * keeping the UI responsive during the server round-trip.
   */
  const [isPending, startTransition] = useTransition();

  /**
   * Initiates a follow action for the target user.
   *
   * Wraps the `onFollow` server action in a transition so React can
   * track its pending state. Shows a success toast with the followed
   * user's username on resolution, or an error toast on rejection.
   *
   * @returns {void}
   */
  const handleFollow = () => {
    startTransition(async () => {
      try {
        const data = await onFollow(userId);
        toast.success(`You are now following ${data.following.username}`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  /**
   * Initiates an unfollow action for the target user.
   *
   * Wraps the `onUnfollow` server action in a transition so React can
   * track its pending state. Shows a success toast with the unfollowed
   * user's username on resolution, or an error toast on rejection.
   *
   * @returns {void}
   */
  const handleUnfollow = () => {
    startTransition(async () => {
      try {
        const data = await onUnfollow(userId);
        toast.success(`You have unfollowed ${data.following.username}`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  /**
   * Handles the follow/unfollow button click event.
   *
   * Delegates to `handleUnfollow` if the target user is currently followed,
   * otherwise delegates to `handleFollow`.
   *
   * @returns {void}
   */
  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  /**
   * Initiates a block action for the target user.
   *
   * Wraps the `onBlock` server action in a transition so React can track
   * its pending state. Shows a success toast with the blocked user's username
   * on resolution, or an error toast on rejection.
   *
   * @returns {void}
   */
  const handleBlock = () => {
    startTransition(async () => {
      try {
        const data = await onBlock(userId);
        toast.success(`You have blocked ${data.blocked.username}`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <>
      {/* Follow/Unfollow toggle button — label reflects the current follow state. */}
      <Button disabled={isPending} variant="primary" onClick={onClick}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      {/* Block button — permanently blocks the target user. */}
      <Button disabled={isPending} onClick={handleBlock}>
        Block
      </Button>
    </>
  );
}
