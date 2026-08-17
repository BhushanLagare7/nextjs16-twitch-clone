/**
 * @file results.tsx
 * @description Provides the `Results` and `ResultsSkeleton` components used
 * on the home page to display a curated list of recommended live streams
 * in a responsive grid layout.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { getStreams } from "@/lib/feed-service";

import { ResultCard, ResultCardSkeleton } from "./result-card";

/**
 * Results component - Fetches and displays a grid of recommended streams.
 *
 * An async Server Component that retrieves stream data via `getStreams()`
 * from the feed service, then renders each stream as a `ResultCard`.
 * Displays an empty-state message when no streams are available.
 *
 * @async
 * @returns {Promise<JSX.Element>} A grid of `ResultCard` components or an empty-state message.
 */
export async function Results() {
  const data = await getStreams();

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">
        Streams we think you&apos;ll like
      </h2>

      {/* Empty state - shown when no streams are returned */}
      {data.length === 0 && (
        <div className="text-sm text-muted-foreground">No streams found.</div>
      )}

      {/* Responsive grid: 1 column on mobile, up to 5 columns on 2xl screens */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.map((result) => (
          <ResultCard key={result.id} data={result} />
        ))}
      </div>
    </div>
  );
}

/**
 * ResultsSkeleton component - Loading skeleton placeholder for `Results`.
 *
 * Renders an animated skeleton layout that mirrors the structure of
 * `Results`, including a heading placeholder and a fixed number of
 * `ResultCardSkeleton` items. Used as the `Suspense` fallback in
 * `HomePage` while stream data is being fetched.
 *
 * @returns {JSX.Element} A skeleton layout matching the Results component structure.
 */
export function ResultsSkeleton() {
  return (
    <div>
      {/* Skeleton for the section heading */}
      <Skeleton className="mb-4 h-8 w-72.5" />

      {/* Responsive skeleton grid matching the Results grid layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {/* Render 4 skeleton cards as placeholders */}
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
