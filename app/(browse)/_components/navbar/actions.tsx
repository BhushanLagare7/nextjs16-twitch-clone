/**
 * @file actions.tsx
 * @description Navigation actions component that handles user authentication
 * state and provides relevant action buttons based on the authentication status.
 */

import Link from "next/link";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ClapperboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Actions component that renders authentication-aware navigation controls.
 * Displays different UI elements based on the user's authentication state.
 *
 * @async
 * @component
 * @example
 * // Basic usage within the Navbar
 * <Actions />
 *
 * @remarks
 * **Unauthenticated state:**
 * - Displays a "Login" button wrapped in Clerk's SignInButton
 *
 * **Authenticated state:**
 * - Displays a link to the user's personal dashboard (`/u/{username}`)
 * - Displays Clerk's UserButton for account management and sign-out
 *
 * This is a server component that fetches the current user session
 * via Clerk's `currentUser()` server-side helper.
 *
 * @returns {Promise<JSX.Element>} A set of action buttons reflecting the
 * current authentication state of the user
 */
export const Actions = async () => {
  /** Fetches the currently authenticated user from Clerk, or null if unauthenticated */
  const user = await currentUser();

  return (
    <div className="ml-4 flex items-center justify-end gap-x-2 lg:ml-0">
      {/* Render login button for unauthenticated users */}
      {!user && (
        <SignInButton>
          <Button size="sm" variant="primary">
            Login
          </Button>
        </SignInButton>
      )}
      {/* Render dashboard link and user menu for authenticated users */}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            asChild
            className="text-muted-foreground hover:text-primary"
            size="sm"
            variant="ghost"
          >
            {/* Dashboard link navigates to the user's personal page */}
            <Link href={`/u/${user.username}`}>
              <ClapperboardIcon className="size-5 lg:mr-2" />
              {/* Label is hidden on mobile and visible on large screens */}
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          {/* Clerk's built-in user account management button */}
          <UserButton />
        </div>
      )}
    </div>
  );
};
