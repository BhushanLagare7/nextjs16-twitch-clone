/**
 * @file page.tsx
 * @description Home page of the application that displays a list of recommended
 * live streams. Renders a responsive grid of stream results with a skeleton
 * fallback while the async data is being loaded.
 */

import { Suspense } from "react";

import { Results, ResultsSkeleton } from "./_components/results";

/**
 * HomePage component - The root page of the application.
 *
 * Wraps the `Results` component in a `Suspense` boundary to handle
 * the async data fetching gracefully, showing `ResultsSkeleton`
 * as a placeholder during loading.
 *
 * @returns {JSX.Element} The home page layout containing the results section.
 */
export default function HomePage() {
  return (
    <div className="mx-auto h-full max-w-screen-2xl p-8">
      {/* Show skeleton placeholder while Results data is being fetched */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results />
      </Suspense>
    </div>
  );
}
