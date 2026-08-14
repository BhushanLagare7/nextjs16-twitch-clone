/**
 * @file Recommended component that displays a list of recommended users
 * in the sidebar, adapting its layout based on the sidebar's collapsed state.
 */

"use client";

import { User } from "@/generated/prisma/client";
import { useSidebar } from "@/store/use-sidebar";

import { UserItem, UserItemSkeleton } from "./user-item";

/** Props for the Recommended component. */
interface RecommendedProps {
  /** Array of user objects (including their associated stream data) to display as recommended. */
  data: (User & {
    stream: { isLive: boolean } | null;
  })[];
}

/**
 * Recommended Component
 *
 * A client component that renders a list of recommended users in the sidebar.
 *
 * Behavior:
 * - Displays a "Recommended" section label only when the sidebar is expanded
 *   and there is at least one user to show.
 * - Renders each user as a `UserItem` with their avatar, username, and live status.
 * - Reads the sidebar's collapsed/expanded state from the `useSidebar` Zustand store.
 *
 * @param {RecommendedProps} props - Props containing the array of recommended users.
 * @returns {JSX.Element} The recommended users list, with an optional section heading.
 *
 * @example
 * <Recommended data={recommendedUsers} />
 */
export function Recommended({ data }: RecommendedProps) {
  const { collapsed } = useSidebar((state) => state);

  // Only show the "Recommended" label when the sidebar is expanded and there are users
  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="mb-4 pl-6">
          <p className="text-sm text-muted-foreground">Recommended</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            imageUrl={user.imageUrl}
            isLive={user.stream?.isLive}
            username={user.username}
          />
        ))}
      </ul>
    </div>
  );
}

/**
 * RecommendedSkeleton Component
 *
 * A static skeleton placeholder displayed while the recommended users list is loading.
 * Renders a fixed number of `UserItemSkeleton` components to simulate the expected layout.
 *
 * @returns {JSX.Element} A list of skeleton user items.
 *
 * @example
 * // Used inside SidebarSkeleton
 * <RecommendedSkeleton />
 */
export function RecommendedSkeleton() {
  return (
    <ul className="px-2">
      {/* Render 3 placeholder skeleton items */}
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
}
