/**
 * @file Layout component for the Browse section of the application.
 * Provides a consistent page structure with a top navigation bar,
 * a collapsible sidebar, and a main content container.
 */

import { Suspense } from "react";

import { Container } from "./_components/container";
import { Navbar } from "./_components/navbar";
import { Sidebar, SidebarSkeleton } from "./_components/sidebar";

/** Props for the BrowseLayout component. */
interface BrowseLayoutProps {
  /** The child page content to render inside the main content container. */
  children: React.ReactNode;
}

/**
 * BrowseLayout Component
 *
 * A layout wrapper for the browse pages that composes the core UI structure:
 * - A fixed top `Navbar`
 * - A collapsible `Sidebar` on the left, wrapped in `Suspense` with a `SidebarSkeleton` fallback
 * - A flexible `Container` for rendering child page content
 *
 * @param {BrowseLayoutProps} props - Layout props containing `children` to render inside the container.
 * @returns {JSX.Element} The full browse page layout.
 *
 * @example
 * // Used automatically by Next.js as a layout for browse routes.
 * <BrowseLayout>
 *   <BrowsePage />
 * </BrowseLayout>
 */
export default function BrowseLayout({ children }: BrowseLayoutProps) {
  return (
    <>
      {/* Fixed top navigation bar */}
      <Navbar />

      {/* Main content area with top padding to account for the fixed Navbar */}
      <div className="flex h-full pt-20">
        {/* Collapsible left sidebar wrapped in Suspense for async data fetching */}
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>

        {/* Dynamic content container that adjusts margin based on sidebar state */}
        <Container>{children}</Container>
      </div>
    </>
  );
}
