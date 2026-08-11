/**
 * @file wrapper.tsx
 * @description Layout wrapper component for the creator dashboard sidebar.
 * Provides the fixed positioning, sizing, and styling for the sidebar container.
 */
"use client";

import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

/**
 * Props for the Wrapper component.
 *
 * @interface WrapperProps
 * @property {React.ReactNode} children - The content to render inside the sidebar wrapper.
 */
interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides the outer layout for the creator dashboard sidebar.
 *
 * Behavior:
 * - Renders a fixed `aside` element on the left side of the viewport.
 * - On mobile/small screens: always displays at a narrow width (w-17.5).
 * - On large screens (lg breakpoint): expands to full width (w-60) when not collapsed,
 *   or remains at narrow width (w-17.5) when collapsed.
 *
 * @param {WrapperProps} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render inside the sidebar.
 * @returns {JSX.Element} A fixed aside element wrapping the sidebar content.
 *
 * @example
 * <Wrapper>
 *   <Toggle />
 *   <Navigation />
 * </Wrapper>
 */
export function Wrapper({ children }: WrapperProps) {
  const { collapsed } = useCreatorSidebar((state) => state);

  return (
    <aside
      className={cn(
        // Base styles: fixed to the left, full height, narrow default width
        "fixed left-0 z-50 flex h-full w-17.5 flex-col border-r border-border bg-background lg:w-60 dark:border-[#2D2E35]",
        // Override to narrow width on large screens when collapsed
        collapsed && "lg:w-17.5",
      )}
    >
      {children}
    </aside>
  );
}
