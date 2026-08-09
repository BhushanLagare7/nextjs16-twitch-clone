/**
 * @file Sidebar component that renders the application's collapsible side navigation.
 * Composes the Wrapper (layout/positioning), Toggle (expand/collapse control),
 * and Recommended (list of recommended users) sub-components.
 */

import { getRecommended } from "@/lib/recommended-service";

import { Recommended, RecommendedSkeleton } from "./recommended";
import { Toggle } from "./toggle";
import { Wrapper } from "./wrapper";

/**
 * Sidebar Component
 *
 * An async server component that renders the application's left-hand sidebar by composing:
 * - `Wrapper`: Provides the fixed positioning, dimensions, and visual styling of the sidebar.
 * - `Toggle`: Provides the expand/collapse button and the "For you" label when expanded.
 * - `Recommended`: Displays a list of recommended users fetched from the database.
 *
 * The sidebar's expanded or collapsed state is managed globally
 * via the `useSidebar` Zustand store.
 *
 * @returns {Promise<JSX.Element>} The sidebar UI composed of Wrapper, Toggle, and Recommended.
 *
 * @example
 * // Used inside BrowseLayout, wrapped in Suspense
 * <Suspense fallback={<SidebarSkeleton />}>
 *   <Sidebar />
 * </Suspense>
 */
export async function Sidebar() {
  const recommended = await getRecommended();

  return (
    <Wrapper>
      {/* Toggle button to expand or collapse the sidebar */}
      <Toggle />
      <div className="space-y-4 pt-4 lg:pt-0">
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
 * Mimics the sidebar's outer shell dimensions and renders a `RecommendedSkeleton`
 * inside to indicate loading state.
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
      <RecommendedSkeleton />
    </aside>
  );
}
