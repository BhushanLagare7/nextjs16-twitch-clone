/**
 * @file Following component that renders the list of users the current user follows
 * in the sidebar, with a skeleton fallback for loading states.
 */

"use client";

import { Follow, User } from "@/generated/prisma/client";
import { useSidebar } from "@/store/use-sidebar";

import { UserItem, UserItemSkeleton } from "./user-item";

/**
 * Props for the Following component.
 */
interface FollowingProps {
  /**
   * Array of Follow records, each joined with the followed User's data
   * and their associated stream (for live status indicators).
   * Fetched server-side and passed down from the parent Sidebar component.
   */
  data: (Follow & {
    following: User & {
      stream: { isLive: boolean } | null;
    };
  })[];
}

/**
 * Following Component
 *
 * Renders the list of users that the currently authenticated user follows.
 * Each followed user is displayed as a `UserItem` within an unordered list.
 *
 * Behaviour:
 * - Returns `null` and renders nothing if the `data` array is empty.
 * - Hides the "Following" section label when the sidebar is collapsed,
 *   matching the sidebar's compact layout.
 * - The collapsed state is read from the global `useSidebar` Zustand store.
 *
 * @param {FollowingProps} props - Component props.
 * @param {(Follow & { following: User & { stream: Stream | null } })[]} props.data - Array of follow relationships
 *   including the followed user's details and their stream live status.
 * @returns {JSX.Element | null} The following list UI, or `null` if there are no followed users.
 *
 * @example
 * // Used inside the Sidebar component
 * <Following data={following} />
 */
export function Following({ data }: FollowingProps) {
  const { collapsed } = useSidebar((state) => state);

  // Render nothing if the current user isn't following anyone
  if (!data.length) {
    return null;
  }

  return (
    <div>
      {/* Only show the "Following" section label when the sidebar is expanded */}
      {!collapsed && (
        <div className="mb-4 pl-6">
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((follow) => (
          <li key={follow.following.id}>
            <UserItem
              imageUrl={follow.following.imageUrl}
              isLive={follow.following.stream?.isLive}
              username={follow.following.username}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * FollowingSkeleton Component
 *
 * A static skeleton placeholder displayed while the `Following` data is being
 * fetched, within a `Suspense` boundary or during initial sidebar load.
 *
 * Renders three `UserItemSkeleton` placeholders to approximate the appearance
 * of a populated following list.
 *
 * @returns {JSX.Element} A list of skeleton user item placeholders.
 *
 * @example
 * // Used inside SidebarSkeleton and Wrapper's server-side fallback
 * <FollowingSkeleton />
 */
export function FollowingSkeleton() {
  return (
    <ul className="px-2 pt-2 lg:pt-0">
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
}
