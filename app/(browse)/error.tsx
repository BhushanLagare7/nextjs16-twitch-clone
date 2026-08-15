"use client";

import { useEffect } from "react";

/**
 * Error boundary for the `(browse)` route group.
 *
 * Catches uncaught exceptions thrown by Server Components (e.g. a failed
 * `currentUser()` call in the navbar) and renders a minimal fallback UI
 * with a retry button instead of crashing the entire page.
 *
 * @param props.error - The error that was thrown.
 * @param props.retry - Callback to re-render the segment.
 */
export default function BrowseError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[Browse] Uncaught error:", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <p className="text-sm text-muted-foreground">Something went wrong.</p>
      <button
        className="text-sm text-primary underline underline-offset-4"
        type="button"
        onClick={() => retry()}
      >
        Try again
      </button>
    </div>
  );
}
