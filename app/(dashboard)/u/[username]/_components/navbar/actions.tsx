/**
 * @file app/(creator)/[username]/_components/navbar/actions.tsx
 * @description Action controls rendered in the creator dashboard navigation bar.
 *
 * Displays a navigation link that exits the creator dashboard and returns the
 * user to the home page, alongside the Clerk `UserButton` for account
 * management.
 *
 * @module CreatorNavbarActions
 */

import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Actions component — renders the exit link and user account button for the
 * creator dashboard navigation bar.
 *
 * Provides two controls:
 * - An "Exit" ghost button that navigates the user back to the home page (`/`),
 *   visually represented by a log-out icon.
 * - The Clerk `UserButton` for profile and account management.
 *
 * @component
 * @returns {JSX.Element} A flex container holding the exit link and user button.
 *
 * @example
 * // Rendered inside the creator Navbar
 * <Actions />
 */
export function Actions() {
  return (
    <div className="flex items-center justify-end gap-x-2">
      {/* Exit button — navigates back to the home page and out of the
          creator dashboard. */}
      <Button
        asChild
        className="text-muted-foreground hover:text-primary"
        size="sm"
        variant="ghost"
      >
        <Link href="/">
          <LogOutIcon className="mr-2 size-5" />
          Exit
        </Link>
      </Button>
      {/* Clerk UserButton — provides profile viewing and account management. */}
      <UserButton />
    </div>
  );
}
