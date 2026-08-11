/**
 * @file Toggle component for expanding and collapsing the sidebar.
 * Renders different UI elements based on the current sidebar state.
 */

"use client";

import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/store/use-sidebar";

/**
 * Toggle Component
 *
 * Renders a button that allows users to expand or collapse the sidebar.
 * Displays different UI based on the sidebar's current state:
 *
 * - **Collapsed state**: Shows a centered icon button (with a right-arrow icon)
 *   to expand the sidebar. Hidden on mobile, visible on `lg` and above.
 *
 * - **Expanded state**: Shows a header row with a "For you" label and an
 *   icon button (with a left-arrow icon) to collapse the sidebar.
 *
 * Both states include a `Hint` tooltip indicating the available action
 * ("Expand" or "Collapse").
 *
 * @returns {JSX.Element} The sidebar toggle UI for the current sidebar state.
 *
 * @example
 * // Rendered inside the Sidebar component via Wrapper
 * <Toggle />
 */
export function Toggle(): React.JSX.Element {
  /**
   * Sidebar state and actions from the global sidebar store.
   * - `collapsed`: Whether the sidebar is currently collapsed.
   * - `onExpand`: Action to expand the sidebar.
   * - `onCollapse`: Action to collapse the sidebar.
   */
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);

  /**
   * Tooltip label reflecting the action available to the user.
   * Shows "Expand" when collapsed, "Collapse" when expanded.
   */
  const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
      {/* Collapsed state: Show expand button (only visible on lg+ screens) */}
      {collapsed && (
        <div className="mb-4 hidden w-full items-center justify-center pt-4 lg:flex">
          <Hint asChild label={label} side="right">
            <Button className="h-auto p-2" variant="ghost" onClick={onExpand}>
              {/* Right arrow icon indicates expand action */}
              <ArrowRightFromLineIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {/* Expanded state: Show "For you" label and collapse button */}
      {!collapsed && (
        <div className="mb-2 flex w-full items-center p-3 pl-6">
          {/* Section label displayed when sidebar is expanded */}
          <p className="font-semibold text-primary">For you</p>

          <Hint asChild label={label} side="right">
            <Button
              className="ml-auto h-auto p-2"
              variant="ghost"
              onClick={onCollapse}
            >
              {/* Left arrow icon indicates collapse action */}
              <ArrowLeftFromLineIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
}

export function ToggleSkeleton(): React.JSX.Element {
  return (
    <div className="mb-2 hidden w-full items-center justify-between p-3 pl-6 lg:flex">
      <Skeleton className="h-6 w-25" />
      <Skeleton className="size-6" />
    </div>
  );
}
