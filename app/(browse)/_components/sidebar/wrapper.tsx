/**
 * @file Wrapper component that provides the fixed layout shell for the Sidebar.
 * Adjusts its width based on the sidebar's collapsed state.
 */

"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

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
 * A fixed-position `<aside>` element that serves as the visual and
 * structural shell of the sidebar. It:
 * - Remains fixed to the left edge of the viewport.
 * - Displays a right border and background styled for light/dark themes.
 * - Dynamically adjusts its width based on the sidebar's collapsed state:
 *   - **Expanded**: `w-60` (240px)
 *   - **Collapsed**: `w-17.5` (70px)
 *
 * The collapsed state is read from the global `useSidebar` Zustand store.
 *
 * @param {WrapperProps} props - Component props.
 * @param {React.ReactNode} props.children - Content to render inside the sidebar wrapper (e.g., Toggle).
 * @returns {JSX.Element} A fixed-position aside element forming the sidebar shell.
 *
 * @example
 * // Used inside the Sidebar component
 * <Wrapper>
 *   <Toggle />
 * </Wrapper>
 */
export function Wrapper({ children }: WrapperProps) {
  /**
   * Reads the `collapsed` state from the global sidebar store.
   * When `true`, the sidebar renders in its narrow/collapsed width.
   */
  const { collapsed } = useSidebar((state) => state);

  return (
    <aside
      className={cn(
        // Base styles: fixed position, left-aligned, full height,
        // column flex layout, right border, and themed background
        "fixed left-0 z-50 flex h-full w-60 flex-col border-r border-border bg-background dark:border-[#2D2E35]",

        // Override width to narrow when sidebar is collapsed
        collapsed && "w-17.5",
      )}
    >
      {children}
    </aside>
  );
}
