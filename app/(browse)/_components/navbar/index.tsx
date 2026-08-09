/**
 * @file navbar/index.tsx
 * @description Main navigation bar component that serves as the primary
 * navigation interface for the application.
 */

import { Actions } from "./actions";
import { Logo } from "./logo";
import { Search } from "./search";

/**
 * Navbar component that renders a fixed navigation bar at the top of the page.
 *
 * @component
 * @example
 * // Basic usage in a layout file
 * <Navbar />
 *
 * @remarks
 * - Fixed position at the top of the viewport with a z-index of 50
 * - Full-width with responsive horizontal padding (px-2 on mobile, px-4 on large screens)
 * - Supports both light (#F5F5F8) and dark (#252731) color modes
 * - Contains three main sections: Logo, Search, and Actions
 *
 * @returns {JSX.Element} A fixed navigation bar with logo, search, and action components
 */
export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-[#F5F5F8] px-2 shadow-sm lg:px-4 dark:bg-[#252731]">
      {/* Application logo and home link */}
      <Logo />
      {/* Search input for finding content */}
      <Search />
      {/* User actions: login or dashboard navigation */}
      <Actions />
    </nav>
  );
}
