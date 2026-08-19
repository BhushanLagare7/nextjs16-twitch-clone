/**
 * @file not-found.tsx
 * @description Global 404 Not Found page displayed when a route cannot be matched.
 * Provides a user-friendly message and a link to navigate back to the home page.
 */

import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * NotFoundPage component.
 *
 * Renders a centered 404 error message with a navigation button
 * that redirects the user back to the home page.
 *
 * @returns {JSX.Element} A full-height centered layout displaying a 404 error.
 */
export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 text-muted-foreground">
      {/* 404 error code heading */}
      <h1 className="text-4xl">404</h1>

      {/* Friendly message informing the user the page was not found */}
      <p>We couldn&apos;t find the page you were looking for.</p>

      {/* Button to navigate back to the home page */}
      <Button asChild variant="secondary">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
