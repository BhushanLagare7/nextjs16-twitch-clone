/**
 * @file app/(browse)/search/page.tsx
 * @description Search page that displays stream results matching a given
 * search term. Redirects to the home page when no search term is provided.
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Results, ResultsSkeleton } from "./_components/results";

/**
 * Props for the {@link SearchPage} component.
 *
 * @interface SearchPageProps
 * @property {Promise<{ term?: string | string[] }>} searchParams - URL query parameters Promise.
 */
interface SearchPageProps {
  searchParams: Promise<{
    term?: string | string[];
  }>;
}

/**
 * Generates search page metadata with robots `noindex, follow` directive
 * to prevent duplicate content and index bloat from arbitrary search queries.
 *
 * @param {SearchPageProps} props - Component properties containing search query params.
 * @returns {Promise<Metadata>} Metadata object for the search page.
 */
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { term } = await searchParams;
  const normalizedTerm = Array.isArray(term) ? term[0] : term;

  return {
    title: normalizedTerm
      ? `Search: "${normalizedTerm}"`
      : "Search Live Streams",
    description: normalizedTerm
      ? `Browse live streams and content creators matching "${normalizedTerm}" on NexusLive.`
      : "Search for live streams, creators, and communities on NexusLive.",
    robots: {
      index: false,
      follow: true,
    },
  };
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

  // Normalize term: if repeated query params produce an array, take the first value
  const normalizedTerm = Array.isArray(term) ? term[0] : term;

  // If there is no search term, redirect to home page
  if (!normalizedTerm) {
    redirect("/");
  }

  return (
    <div className="mx-auto h-full max-w-screen-2xl p-8">
      {/* Show ResultsSkeleton while Results fetches stream data */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results term={normalizedTerm} />
      </Suspense>
    </div>
  );
}
