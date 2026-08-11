/**
 * @file nav-item.tsx
 * @description Navigation item components for the creator dashboard sidebar.
 * Provides both the interactive NavItem and its loading skeleton NavItemSkeleton.
 */
"use client";

import Link from "next/link";

import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

/**
 * Props for the NavItem component.
 *
 * @interface NavItemProps
 * @property {LucideIcon} icon - The Lucide icon component to display.
 * @property {string} label - The text label for the navigation item.
 * @property {string} href - The URL path the navigation item links to.
 * @property {boolean} isActive - Whether this navigation item represents the current page.
 */
interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

/**
 * NavItem component that renders a single navigation link in the sidebar.
 * Adapts its layout based on the sidebar's collapsed state:
 * - When collapsed: shows only the icon, centered.
 * - When expanded: shows icon and label, left-aligned.
 * Highlights with accent background when the current route matches its href.
 *
 * @param {NavItemProps} props - Component props.
 * @param {LucideIcon} props.icon - Icon to display for this navigation item.
 * @param {string} props.label - Text label for this navigation item.
 * @param {string} props.href - URL path this item navigates to.
 * @param {boolean} props.isActive - Whether this is the currently active route.
 * @returns {JSX.Element} A navigation button that links to the specified href.
 *
 * @example
 * <NavItem
 *   icon={FullscreenIcon}
 *   label="Stream"
 *   href="/u/username"
 *   isActive={true}
 * />
 */
export function NavItem({ icon: Icon, label, href, isActive }: NavItemProps) {
  const { collapsed } = useCreatorSidebar((state) => state);

  return (
    <Button
      asChild
      className={cn(
        "h-12 w-full",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent",
      )}
      variant="ghost"
    >
      <Link href={href}>
        <div className="flex items-center gap-x-4">
          {/* Navigation icon with responsive margin based on sidebar state */}
          <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
          {/* Label is hidden when the sidebar is collapsed */}
          {!collapsed && <span>{label}</span>}
        </div>
      </Link>
    </Button>
  );
}

/**
 * NavItemSkeleton component that renders a placeholder loading state
 * for a navigation item. Used while user data is being fetched.
 * Displays a square skeleton for the icon and a wider skeleton for the label.
 *
 * @returns {JSX.Element} A skeleton placeholder for a navigation item.
 *
 * @example
 * // Render 4 skeleton items while loading
 * {[...Array(4)].map((_, i) => (
 *   <NavItemSkeleton key={i} />
 * ))}
 */
export function NavItemSkeleton() {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      {/* Icon placeholder */}
      <Skeleton className="min-h-12 min-w-12 rounded-md" />
      {/* Label placeholder - only visible on large screens */}
      <div className="hidden flex-1 lg:block">
        <Skeleton className="h-6" />
      </div>
    </li>
  );
}
