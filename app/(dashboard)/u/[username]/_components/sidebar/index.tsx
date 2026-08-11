/**
 * @file sidebar.tsx
 * @description Sidebar component for the creator dashboard.
 * Composes the sidebar layout using Wrapper, Toggle, and Navigation components.
 */
import { Navigation } from "./navigation";
import { Toggle } from "./toggle";
import { Wrapper } from "./wrapper";

/**
 * Sidebar component that renders the creator dashboard's side navigation.
 * Combines the Wrapper layout component with Toggle and Navigation functionality.
 * The sidebar supports both expanded and collapsed states,
 * managed through the Toggle component.
 *
 * @returns {JSX.Element} A sidebar containing toggle and navigation components.
 *
 * @example
 * // Usage in a dashboard layout
 * <Sidebar />
 */
export function Sidebar(): React.JSX.Element {
  return (
    <Wrapper>
      {/* Controls sidebar expanded/collapsed state */}
      <Toggle />
      {/* Renders the main navigation links */}
      <Navigation />
    </Wrapper>
  );
}
