/**
 * @file app/(browse)/[username]/_components/actions.tsx
 * @description Client-side follow/unfollow action component for user profile pages.
 *
 * Renders a single button that toggles the follow state between the
 * currently authenticated user and a target user. Uses React's
 * `useTransition` hook to track pending server action states and
 * display toast notifications on success or failure.
 *
 * @module Actions
 */

"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";

/**
 * Props for the Actions component.
 *
 * @interface ActionsProps
 * @property {boolean} isFollowing - Whether the current user already follows
 *   the target user. Determines the initial button label and action.
 * @property {string} userId - The unique identifier of the target user
 *   to follow or unfollow.
 */
interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

/**
 * Actions component — renders a follow/unfollow toggle button.
 *
 * Manages the asynchronous follow/unfollow server action calls within
 * a React transition to avoid blocking the UI. Displays a success toast
 * with the followed/unfollowed username on completion, or an error toast
 * if the action fails.
 *
 * The button is disabled while any transition is in progress to prevent
 * duplicate submissions.
 *
 * @component
 * @param {ActionsProps} props - The component props.
 * @param {boolean} props.isFollowing - Current follow state for the target user.
 * @param {string} props.userId - ID of the user to follow or unfollow.
 *
 * @returns {JSX.Element} A follow/unfollow button with pending state handling.
 *
 * @example
 * <Actions isFollowing={false} userId="user_abc123" />
 */
export function Actions({ isFollowing, userId }: ActionsProps) {
  /**
   * `isPending` — true while the follow/unfollow server action is in flight.
   * `startTransition` — wraps the async action to mark it as a non-urgent update,
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
   * Handles the button click event.
   *
   * Delegates to `handleUnfollow` if the user is currently followed,
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

  return (
    <Button disabled={isPending} variant="primary" onClick={onClick}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
