/**
 * @file toggle.tsx
 * @description Sidebar toggle component for expanding and collapsing the creator dashboard sidebar.
 * Only visible on large screens (lg breakpoint and above).
 */
"use client";

import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

/**
 * Toggle component that controls the sidebar's collapsed/expanded state.
 *
 * Behavior:
 * - When collapsed: renders a centered button with a right-arrow icon to expand the sidebar.
 * - When expanded: renders a header with "Dashboard" text and a left-arrow icon button to collapse.
 * - Both states include a Hint tooltip indicating the available action.
 * - Only visible on large screens (hidden on mobile).
 *
 * Uses the `useCreatorSidebar` store to read and update the sidebar state.
 *
 * @returns {JSX.Element} A toggle button for expanding or collapsing the sidebar.
 *
 * @example
 * // Usage in Sidebar
 * <Toggle />
 */
export function Toggle(): React.JSX.Element {
  const { collapsed, onExpand, onCollapse } = useCreatorSidebar(
    (state) => state,
  );

  /** Tooltip label that reflects the available sidebar action */
  const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
      {/* Expand button - shown when the sidebar is collapsed */}
      {collapsed && (
        <div className="mb-4 hidden w-full items-center justify-center pt-4 lg:flex">
          <Hint asChild label={label} side="right">
            <Button
              aria-label="Expand"
              className="h-auto p-2"
              variant="ghost"
              onClick={onExpand}
            >
              <ArrowRightFromLineIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {/* Collapse button with header - shown when the sidebar is expanded */}
      {!collapsed && (
        <div className="mb-2 hidden w-full items-center p-3 pl-6 lg:flex">
          <p className="font-semibold text-primary">Dashboard</p>
          <Hint asChild label={label} side="right">
            <Button
              aria-label="Collapse"
              className="ml-auto h-auto p-2"
              variant="ghost"
              onClick={onCollapse}
            >
              <ArrowLeftFromLineIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
}
