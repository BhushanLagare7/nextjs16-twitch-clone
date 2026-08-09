/**
 * @file Container component that wraps the main page content.
 * Responds to viewport size changes to automatically collapse
 * or expand the sidebar, and adjusts its own margin accordingly.
 */

"use client";

import { useEffect } from "react";

import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

/**
 * Props for the Container component.
 */
interface ContainerProps {
  /** The child elements to render inside the container. */
  children: React.ReactNode;
}

/**
 * Container Component
 *
 * A responsive wrapper for the main page content that:
 * - Listens to viewport width changes via a media query.
 * - Automatically collapses the sidebar on screens ≤ 1024px wide.
 * - Automatically expands the sidebar on screens > 1024px wide.
 * - Adjusts its left margin dynamically based on the sidebar's collapsed state.
 *
 * @param {ContainerProps} props - Component props.
 * @param {React.ReactNode} props.children - Content to display inside the container.
 * @returns {JSX.Element} A responsive div that wraps the main page content.
 *
 * @example
 * <Container>
 *   <main>Page content goes here</main>
 * </Container>
 */
export function Container({ children }: ContainerProps) {
  /**
   * Tracks whether the viewport width matches the small screen breakpoint (≤ 1024px).
   * `true` when screen width is 1024px or below, `false` otherwise.
   */
  const matches = useMediaQuery("(max-width: 1024px)");

  /**
   * Sidebar state and actions from the global sidebar store.
   * - `collapsed`: Whether the sidebar is currently collapsed.
   * - `onCollapse`: Action to collapse the sidebar.
   * - `onExpand`: Action to expand the sidebar.
   */
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);

  /**
   * Effect: Syncs sidebar state with the current viewport size.
   * - Collapses the sidebar when the screen is small (≤ 1024px).
   * - Expands the sidebar when the screen is large (> 1024px).
   * Runs whenever the media query result or sidebar actions change.
   */
  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExpand();
    }
  }, [matches, onCollapse, onExpand]);

  return (
    /*
     * Applies a left margin to offset the sidebar width.
     * - When collapsed: fixed small margin (ml-17.5) on all screen sizes.
     * - When expanded: small margin on mobile, larger margin (ml-60) on lg+ screens.
     */
    <div className={cn("flex-1", collapsed ? "ml-17.5" : "ml-17.5 lg:ml-60")}>
      {children}
    </div>
  );
}
