/**
 * @file navigation.tsx
 * @description Navigation component for the creator dashboard sidebar.
 * Renders a list of navigation links based on the authenticated user's profile.
 */
"use client";

import { usePathname } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import {
  FullscreenIcon,
  KeyRoundIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react";

import { NavItem, NavItemSkeleton } from "./nav-item";

/**
 * Navigation component that renders the sidebar navigation links
 * for the creator dashboard.
 *
 * Behavior:
 * - Shows skeleton loaders while the user data is being fetched.
 * - Renders navigation items for Stream, Keys, Chat, and Community sections
 *   once the user is authenticated.
 * - Highlights the active navigation item based on the current URL path.
 *
 * @returns {JSX.Element} A navigation list with links to dashboard sections,
 * or skeleton placeholders while loading.
 *
 * @example
 * // Usage in Sidebar
 * <Navigation />
 */
export function Navigation(): React.JSX.Element {
  const pathname = usePathname();
  const { user } = useUser();

  /**
   * Route configuration for the creator dashboard navigation.
   * Each route maps a label and icon to a user-specific URL path.
   */
  const routes = [
    {
      label: "Stream",
      href: `/u/${user?.username}`,
      icon: FullscreenIcon,
    },
    {
      label: "Keys",
      href: `/u/${user?.username}/keys`,
      icon: KeyRoundIcon,
    },
    {
      label: "Chat",
      href: `/u/${user?.username}/chat`,
      icon: MessageSquareIcon,
    },
    {
      label: "Community",
      href: `/u/${user?.username}/community`,
      icon: UsersIcon,
    },
  ];

  /**
   * Show skeleton placeholders while the user data (specifically username)
   * is not yet available.
   */
  if (!user?.username) {
    return (
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          isActive={pathname === route.href}
          label={route.label}
        />
      ))}
    </ul>
  );
}
