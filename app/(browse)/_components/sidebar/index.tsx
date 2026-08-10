/**
 * @file Sidebar component that renders the application's collapsible side navigation.
 * Composes the Wrapper (layout/positioning), Toggle (expand/collapse control),
 * Following (list of followed users), and Recommended (list of recommended users)
 * sub-components.
 */

import { getFollowedUsers } from "@/lib/follow-service";
import { getRecommended } from "@/lib/recommended-service";

import { Following, FollowingSkeleton } from "./following";
import { Recommended, RecommendedSkeleton } from "./recommended";
import { Toggle, ToggleSkeleton } from "./toggle";
import { Wrapper } from "./wrapper";

/**
 * Sidebar Component
 *
 * An async server component that renders the application's left-hand sidebar by composing:
 * - `Wrapper`: Provides the fixed positioning, dimensions, and visual styling of the sidebar.
 * - `Toggle`: Provides the expand/collapse button and the "For you" label when expanded.
 * - `Following`: Displays a list of users the current user follows, fetched from the database.
 * - `Recommended`: Displays a list of recommended users fetched from the database.
 *
 * The sidebar's expanded or collapsed state is managed globally
 * via the `useSidebar` Zustand store.
 *
 * @returns {Promise<JSX.Element>} The sidebar UI composed of Wrapper, Toggle, Following,
 *   and Recommended.
 *
 * @example
 * // Used inside a layout, wrapped in Suspense to show SidebarSkeleton while loading
 * <Suspense fallback={<SidebarSkeleton />}>
 *   <Sidebar />
 * </Suspense>
 */
export async function Sidebar() {
  const recommended = await getRecommended();
  const following = await getFollowedUsers();

  return (
    <Wrapper>
      {/* Toggle button to expand or collapse the sidebar */}
      <Toggle />
      <div className="space-y-4 pt-4 lg:pt-0">
        {/* List of users the current user follows, fetched server-side */}
        <Following data={following} />
        {/* List of recommended users fetched server-side */}
        <Recommended data={recommended} />
      </div>
    </Wrapper>
  );
}

/**
 * SidebarSkeleton Component
 *
 * A static skeleton placeholder displayed while the async `Sidebar` component
 * is loading within a `Suspense` boundary.
 *
 * Mimics the sidebar's full layout by rendering:
 * - `ToggleSkeleton`: Placeholder for the expand/collapse toggle area.
 * - `FollowingSkeleton`: Placeholder for the followed users list.
 * - `RecommendedSkeleton`: Placeholder for the recommended users list.
 *
 * @returns {JSX.Element} A fixed-position skeleton sidebar shell.
 *
 * @example
 * <Suspense fallback={<SidebarSkeleton />}>
 *   <Sidebar />
 * </Suspense>
 */
export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 z-50 flex h-full w-17.5 flex-col border-r border-border bg-background lg:w-60 dark:border-[#2D2E35]">
      <ToggleSkeleton />
      <FollowingSkeleton />
      <RecommendedSkeleton />
    </aside>
  );
}
