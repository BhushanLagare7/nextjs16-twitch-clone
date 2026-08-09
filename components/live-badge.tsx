/**
 * @file LiveBadge component that renders a small "LIVE" indicator badge,
 * used to signal that a user is currently streaming.
 */

import { cn } from "@/lib/utils";

/** Props for the LiveBadge component. */
interface LiveBadgeProps {
  /**
   * Optional additional CSS class names to apply to the badge container.
   * Useful for positioning adjustments (e.g., `ml-auto`).
   */
  className?: string;
}

/**
 * LiveBadge Component
 *
 * Renders a small, styled badge displaying the text "LIVE" in uppercase.
 * Used to visually indicate that a user is currently live streaming.
 *
 * Styling:
 * - Rose/red background (`bg-rose-500`) with white text.
 * - Rounded corners, compact padding, and small uppercase tracking for readability.
 * - Accepts an optional `className` prop for layout or spacing overrides.
 *
 * @param {LiveBadgeProps} props - Props for the badge, including optional className.
 * @returns {JSX.Element} A styled "LIVE" badge element.
 *
 * @example
 * // Inline usage next to a username
 * <LiveBadge />
 *
 * @example
 * // With custom positioning class
 * <LiveBadge className="ml-auto" />
 */
export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-background bg-rose-500 p-0.5 px-1.5 text-center text-[10px] font-semibold tracking-wide text-white uppercase",
        className,
      )}
    >
      Live
    </div>
  );
}
