/**
 * @file UserItem component that renders a single user entry in the sidebar,
 * including their avatar, username, and live status indicator.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LiveBadge } from "@/components/live-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

/** Props for the UserItem component. */
interface UserItemProps {
  /** The user's unique username, used for routing and display. */
  username: string;
  /** URL of the user's profile image. */
  imageUrl: string;
  /**
   * Whether the user is currently live streaming.
   * @default false
   */
  isLive?: boolean;
}

/**
 * UserItem Component
 *
 * A client component that renders a single clickable user entry in the sidebar.
 *
 * Features:
 * - Navigates to `/{username}` on click.
 * - Highlights the item with an accent background when the current route matches the user's profile.
 * - Adapts layout based on the sidebar's collapsed state (icon-only vs. icon + label).
 * - Displays a `LiveBadge` next to the username when the user is live and the sidebar is expanded.
 *
 * @param {UserItemProps} props - Props for rendering the user item.
 * @returns {JSX.Element} A styled button link representing a sidebar user entry.
 *
 * @example
 * <UserItem
 *   username="johndoe"
 *   imageUrl="https://example.com/avatar.jpg"
 *   isLive={true}
 * />
 */
export function UserItem({ username, imageUrl, isLive }: UserItemProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar((state) => state);

  const href = `/${username}`;
  const isActive = pathname === href;

  return (
    <Button
      asChild
      className={cn(
        "h-12 w-full",
        // Center content when collapsed, left-align when expanded
        collapsed ? "justify-center" : "justify-start",
        // Highlight active route
        isActive && "bg-accent",
      )}
      variant="ghost"
    >
      <Link aria-label={username} href={href}>
        <div
          className={cn(
            "flex w-full items-center gap-x-4",
            collapsed && "justify-center",
          )}
        >
          {/* User avatar with live ring indicator */}
          <UserAvatar imageUrl={imageUrl} isLive={isLive} username={username} />
          {/* Username label — hidden when sidebar is collapsed */}
          {!collapsed && <p className="truncate">{username}</p>}
          {/* Live badge — shown only when expanded and user is live */}
          {!collapsed && isLive && <LiveBadge className="ml-auto" />}
        </div>
      </Link>
    </Button>
  );
}

/**
 * UserItemSkeleton Component
 *
 * A static skeleton placeholder for a `UserItem` entry, displayed while
 * user data is being loaded.
 *
 * Renders a circular avatar skeleton alongside a rectangular username skeleton.
 *
 * @returns {JSX.Element} A skeleton list item mimicking a UserItem's layout.
 *
 * @example
 * // Used inside RecommendedSkeleton
 * <UserItemSkeleton />
 */
export function UserItemSkeleton() {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      {/* Avatar placeholder */}
      <Skeleton className="min-h-8 min-w-8 rounded-full" />
      <div className="flex-1">
        {/* Username placeholder */}
        <Skeleton className="h-6" />
      </div>
    </li>
  );
}
