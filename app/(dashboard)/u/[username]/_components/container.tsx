/**
 * @file app/(dashboard)/u/[username]/_components/container.tsx
 * @description Responsive main content container for the creator dashboard layout.
 *
 * Automatically collapses or expands the creator sidebar based on the viewport
 * width, and adjusts its own left margin to match the sidebar's current state,
 * ensuring the content area always fills the available horizontal space.
 *
 * @module Container
 */

"use client";

import { useEffect } from "react";

import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

/**
 * Props for the Container component.
 *
 * @interface ContainerProps
 * @property {React.ReactNode} children - The page content to render inside
 *   the container.
 */
interface ContainerProps {
  children: React.ReactNode;
}

/**
 * Container component — responsive content wrapper for the creator dashboard.
 *
 * Observes the viewport width via `useMediaQuery` and automatically triggers
 * sidebar collapse on screens 1024 px wide or narrower, and sidebar expansion
 * on wider screens. Adjusts its left margin dynamically to align with the
 * sidebar's collapsed or expanded state.
 *
 * @component
 * @param {ContainerProps} props - The component props.
 * @param {React.ReactNode} props.children - Content to render inside the
 *   container.
 *
 * @returns {JSX.Element} A responsive `div` that wraps nested page content
 *   and reacts to sidebar state changes.
 *
 * @example
 * <Container>
 *   <DashboardPage />
 * </Container>
 */
export function Container({ children }: ContainerProps) {
  /**
   * Sidebar state and control actions from the creator sidebar store.
   *
   * - `collapsed` — whether the sidebar is currently in its collapsed state.
   * - `onCollapse` — action that transitions the sidebar to its collapsed state.
   * - `onExpand` — action that transitions the sidebar to its expanded state.
   */
  const { collapsed, onCollapse, onExpand } = useCreatorSidebar(
    (state) => state,
  );

  /**
   * `matches` — true when the viewport width is 1024 px or narrower.
   * Used to determine whether the sidebar should be auto-collapsed.
   */
  const matches = useMediaQuery(`(max-width: 1024px)`);

  /**
   * Automatically collapses the sidebar on narrow viewports and expands it
   * on wider viewports whenever the media query result or control actions change.
   */
  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExpand();
    }
  }, [matches, onCollapse, onExpand]);

  return (
    /**
     * Left margin switches between the collapsed sidebar width (`ml-17.5`)
     * and the expanded sidebar width (`lg:ml-60`) depending on `collapsed`.
     * `flex-1` ensures the container fills all remaining horizontal space.
     */
    <div className={cn("flex-1", collapsed ? "ml-17.5" : "ml-17.5 lg:ml-60")}>
      {children}
    </div>
  );
}
