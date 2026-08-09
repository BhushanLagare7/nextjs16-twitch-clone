/**
 * @file Sidebar component that renders the application's collapsible side navigation.
 * Composes the Wrapper (layout/positioning) and Toggle (expand/collapse control).
 */

import { Toggle } from "./toggle";
import { Wrapper } from "./wrapper";

/**
 * Sidebar Component
 *
 * Renders the application's left-hand sidebar by composing:
 * - `Wrapper`: Provides the fixed positioning, dimensions, and visual styling of the sidebar.
 * - `Toggle`: Provides the expand/collapse button and the "For you" label when expanded.
 *
 * The sidebar's expanded or collapsed state is managed globally
 * via the `useSidebar` Zustand store.
 *
 * @returns {JSX.Element} The sidebar UI composed of Wrapper and Toggle.
 *
 * @example
 * // Used inside BrowseLayout
 * <Sidebar />
 */
export function Sidebar() {
  return (
    <Wrapper>
      {/* Toggle button to expand or collapse the sidebar */}
      <Toggle />
    </Wrapper>
  );
}
