/**
 * @file error.tsx
 * @description Client-side error boundary page for the browse section.
 * Displayed when an unexpected error occurs while browsing streams or content.
 * Provides a user-friendly message and a link to navigate back to the home page.
 */

"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * BrowseErrorPage component.
 *
 * Renders a centered error message with a navigation button
 * that redirects the user back to the home page.
 * Used as a Next.js error boundary within the browse route segment.
 *
 * @returns {JSX.Element} A full-height centered layout displaying a generic error message.
 */
export default function BrowseErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 text-muted-foreground">
      <title>Error - Something went wrong | NexusLive</title>
      {/* Generic error message displayed when something goes wrong */}
      <p>Something went wrong</p>

      {/* Button to navigate back to the home page */}
      <Button asChild variant="secondary">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
