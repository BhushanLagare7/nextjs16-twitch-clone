/**
 * @file not-found.tsx
 * @description 404 Not Found page specific to user profile/stream pages.
 * Displayed when the requested username does not exist or cannot be found.
 * Provides a user-friendly message and a link to navigate back to the home page.
 */

import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * UserNotFoundPage component.
 *
 * Renders a centered 404 error message specific to missing user profiles,
 * along with a navigation button that redirects the user back to the home page.
 *
 * @returns {JSX.Element} A full-height centered layout displaying a user-specific 404 error.
 */
export default function UserNotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
      {/* 404 error code heading */}
      <h1 className="text-4xl">404</h1>

      {/* Friendly message informing the user that the requested user was not found */}
      <p>We couldn&apos;t find the user you were looking for.</p>

      {/* Button to navigate back to the home page */}
      <Button asChild variant="secondary">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
