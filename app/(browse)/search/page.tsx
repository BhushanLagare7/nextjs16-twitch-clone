/**
 * @file app/(browse)/search/page.tsx
 * @description Search page that displays stream results matching a given
 * search term. Redirects to the home page when no search term is provided.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Results, ResultsSkeleton } from "./_components/results";

/**
 * Props for the {@link SearchPage} component.
 *
 * @interface SearchPageProps
 * @property {object}  searchParams       - URL query parameters.
 * @property {string} [searchParams.term] - The search term entered by the user.
 *                                          If absent, the user is redirected to "/".
 */
interface SearchPageProps {
  searchParams: Promise<{
    term?: string;
  }>;
}

/**
 * Server-side search page component.
 *
 * Validates that a search term is present in the URL query parameters.
 * If no term is provided, redirects the user to the home page ("/").
 * Otherwise, renders the {@link Results} component wrapped in a
 * {@link Suspense} boundary that shows {@link ResultsSkeleton} while
 * the search results are being fetched.
 *
 * @param {SearchPageProps} props                  - Component props.
 * @param {Promise<object>} props.searchParams      - Parsed URL query parameters Promise.
 * @returns {Promise<JSX.Element>} The search results page, or a redirect response.
 *
 * @example
 * // Navigating to /search?term=gaming renders results for "gaming".
 * // Navigating to /search redirects to "/".
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = await searchParams;

  // If there is no search term, redirect to home page
  if (!term) {
    redirect("/");
  }

  return (
    <div className="mx-auto h-full max-w-screen-2xl p-8">
      {/* Show ResultsSkeleton while Results fetches stream data */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results term={term} />
      </Suspense>
    </div>
  );
}
