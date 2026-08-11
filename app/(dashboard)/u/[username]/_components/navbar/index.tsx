/**
 * @file navbar.tsx
 * @description Root navigation bar component for the application.
 * Renders a fixed top navigation bar containing the logo and action buttons.
 */
import { Actions } from "./actions";
import { Logo } from "./logo";

/**
 * Navbar component that renders a fixed top navigation bar.
 * The navbar spans the full width of the viewport and stays fixed at the top
 * with a z-index ensuring it appears above other content.
 *
 * @returns {JSX.Element} A fixed navigation bar with Logo and Actions components.
 *
 * @example
 * // Usage in a layout component
 * <Navbar />
 */
export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-[#F5F5F8] px-2 shadow-sm lg:px-4 dark:bg-[#252731]">
      {/* Application logo with home link */}
      <Logo />
      {/* User action buttons e.g., login, notifications */}
      <Actions />
    </nav>
  );
}
