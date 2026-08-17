/**
 * @file components/stream-player/actions.tsx
 * @description Follow/unfollow action button for a stream host's channel.
 *
 * Renders a toggle button that allows an authenticated viewer to follow or
 * unfollow the stream host. Unauthenticated users are redirected to the
 * sign-in page, and hosts are prevented from following themselves.
 * Also exports {@link ActionsSkeleton}, the corresponding loading state.
 *
 * @module Actions
 */

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Props for the {@link Actions} component.
 *
 * @interface ActionsProps
 *
 * @property {string} hostIdentity - The unique identity of the stream host,
 *   used to target follow/unfollow server actions.
 * @property {boolean} isFollowing - Whether the current viewer already
 *   follows this host. Determines the button label and behavior.
 * @property {boolean} isHost - Whether the current viewer is the host of
 *   this stream. Hosts cannot follow their own channel; the button is
 *   disabled when `true`.
 */
interface ActionsProps {
  hostIdentity: string;
  isFollowing: boolean;
  isHost: boolean;
}

/**
 * Renders a follow/unfollow toggle button for a stream host's channel.
 *
 * - If the viewer is **not authenticated**, clicking redirects them to
 *   `/sign-in` via Next.js's client-side router.
 * - If the viewer **is the host**, the button is disabled and no action
 *   is taken.
 * - Otherwise, clicking toggles the follow state by calling the
 *   {@link onFollow} or {@link onUnfollow} server actions, and surfaces
 *   success or error feedback via toast notifications.
 *
 * The button is also disabled while a follow/unfollow transition is
 * in-flight to prevent duplicate submissions.
 *
 * @function Actions
 *
 * @param {ActionsProps} props - Component props.
 *
 * @returns {JSX.Element} A button labelled "Follow" or "Unfollow" with a
 *   filled or outlined heart icon reflecting the current follow state.
 *
 * @example
 * <Actions
 *   hostIdentity="user_abc123"
 *   isFollowing={false}
 *   isHost={false}
 * />
 */
export function Actions({ hostIdentity, isFollowing, isHost }: ActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { userId } = useAuth();

  /**
   * Initiates a follow action for the host identified by `hostIdentity`.
   * Wraps the server action call in a React transition so the UI remains
   * responsive during the async operation. Displays a success toast with
   * the followed user's username on completion, or an error toast on failure.
   */
  const handleFollow = () => {
    startTransition(async () => {
      try {
        const data = await onFollow(hostIdentity);
        toast.success(`You are now following ${data.following.username}`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  /**
   * Initiates an unfollow action for the host identified by `hostIdentity`.
   * Wraps the server action call in a React transition so the UI remains
   * responsive during the async operation. Displays a success toast with
   * the unfollowed user's username on completion, or an error toast on failure.
   */
  const handleUnfollow = () => {
    startTransition(async () => {
      try {
        const data = await onUnfollow(hostIdentity);
        toast.success(`You have unfollowed ${data.following.username}`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  /**
   * Handles the button click event by routing the user appropriately:
   * - Redirects unauthenticated users to `/sign-in`.
   * - Returns early without action if the viewer is the host.
   * - Calls {@link handleUnfollow} if currently following,
   *   or {@link handleFollow} otherwise.
   */
  const toggleFollow = () => {
    if (!userId) {
      return router.push("/sign-in");
    }

    if (isHost) return;

    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <Button
      className="w-full lg:w-auto"
      disabled={isPending || isHost}
      size="sm"
      variant="primary"
      onClick={toggleFollow}
    >
      <HeartIcon
        className={cn("mr-2 size-4", isFollowing ? "fill-white" : "fill-none")}
      />
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

/**
 * Loading state for {@link Actions}, rendered while follow status or
 * user data is being resolved. Mirrors the real button's dimensions with
 * a skeleton placeholder.
 *
 * @function ActionsSkeleton
 * @returns {JSX.Element} A skeleton element sized to match the Actions button.
 */
export function ActionsSkeleton() {
  return <Skeleton className="h-10 w-full lg:w-24" />;
}
