/**
 * @file Wrapper component that provides the fixed layout shell for the Sidebar.
 * Adjusts its width based on the sidebar's collapsed state, and renders skeleton
 * placeholders on the server before client-side hydration.
 */

"use client";

import { useIsClient } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

import { FollowingSkeleton } from "./following";
import { RecommendedSkeleton } from "./recommended";
import { ToggleSkeleton } from "./toggle";

/**
 * Props for the Wrapper component.
 */
interface WrapperProps {
  /** The child elements to render inside the sidebar wrapper. */
  children: React.ReactNode;
}

/**
 * Wrapper Component
 *
 * A client-side, fixed-position `<aside>` element that serves as the visual and
 * structural shell of the sidebar. It:
 * - Remains fixed to the left edge of the viewport at full height.
 * - Displays a right border and background colour styled for light/dark themes.
 * - Dynamically adjusts its width based on the sidebar's collapsed state:
 *   - **Expanded**: `w-60` (240px)
 *   - **Collapsed**: `w-17.5` (70px)
 *
 * The collapsed state is read from the global `useSidebar` Zustand store.
 *
 * **SSR / Hydration behaviour:**
 * Before client-side hydration, `useIsClient` returns `false`, so the component
 * renders a static skeleton shell (containing `ToggleSkeleton`, `FollowingSkeleton`,
 * and `RecommendedSkeleton`) to prevent layout shifts and hydration mismatches.
 * Once hydrated, the real sidebar content (`children`) is rendered.
 *
 * @param {WrapperProps} props - Component props.
 * @param {React.ReactNode} props.children - Content to render inside the sidebar
 *   wrapper once hydrated (e.g., Toggle, Following, Recommended).
 * @returns {JSX.Element} A fixed-position aside element forming the sidebar shell.
 *
 * @example
 * // Used inside the Sidebar server component
 * <Wrapper>
 *   <Toggle />
 *   <Following data={following} />
 *   <Recommended data={recommended} />
 * </Wrapper>
 */
export function Wrapper({ children }: WrapperProps) {
  /**
   * Returns `false` during SSR and before client-side hydration, `true` afterwards.
   * Used to avoid hydration mismatches caused by reading client-only Zustand state.
   */
  const isClient = useIsClient();

  /**
   * Reads the `collapsed` state from the global sidebar Zustand store.
   * When `true`, the sidebar renders in its narrow/collapsed width (`w-17.5`).
   * When `false`, the sidebar renders at full width (`w-60`).
   */
  const { collapsed } = useSidebar((state) => state);

  /**
   * Before hydration, render a static skeleton shell that mirrors the sidebar's
   * default (expanded on large screens, collapsed on small screens) dimensions.
   * This prevents a layout shift when the real sidebar mounts.
   */
  if (!isClient) {
    return (
      <aside className="fixed left-0 z-50 flex h-full w-17.5 flex-col border-r border-border bg-background lg:w-60 dark:border-[#2D2E35]">
        <ToggleSkeleton />
        <FollowingSkeleton />
        <RecommendedSkeleton />
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        // Base styles: fixed position, left-aligned, full height,
        // column flex layout, right border, and themed background.
        // Defaults to expanded width (w-60) on all screen sizes.
        "fixed left-0 z-50 flex h-full w-60 flex-col border-r border-border bg-background dark:border-[#2D2E35]",

        // Override width to narrow (w-17.5) when the sidebar is collapsed
        collapsed && "w-17.5",
      )}
    >
      {children}
    </aside>
  );
}
