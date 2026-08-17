/**
 * @file loading.tsx
 * @description Loading state for user profile/stream pages.
 * Displayed automatically by Next.js while the user page data is being fetched.
 * Renders a skeleton placeholder to improve perceived performance.
 */

import { StreamPlayerSkeleton } from "@/components/stream-player";

/**
 * UserLoading component.
 *
 * Renders a full-height skeleton placeholder for the stream player
 * while the user's stream data is being loaded.
 * Used as a Next.js loading UI within the user profile route segment.
 *
 * @returns {JSX.Element} A full-height container with the StreamPlayer skeleton.
 */
export default function UserLoading() {
  return (
    <div className="h-full">
      {/* Skeleton placeholder displayed while the stream player data is loading */}
      <StreamPlayerSkeleton />
    </div>
  );
}
