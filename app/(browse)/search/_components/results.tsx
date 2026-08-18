/**
 * @file app/(browse)/search/_components/results.tsx
 * @description Provides the {@link Results} and {@link ResultsSkeleton}
 * components used to render a list of stream search results and their
 * corresponding loading state on the search page.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { getSearch } from "@/lib/search-service";

import { ResultCardSkeleton } from "./result-card";
import { ResultsList } from "./results-list";

/**
 * Props for the {@link Results} component.
 *
 * @interface ResultsProps
 * @property {string} [term] - The search term used to query streams.
 *                             Passed directly to {@link getSearch}.
 */
interface ResultsProps {
  term?: string;
}

/**
 * Results component - Fetches and displays stream search results.
 *
 * An async Server Component that calls {@link getSearch} with the provided
 * `term`. Renders a heading indicating the search term, a fallback message
 * if no results are found, or a {@link ResultsList} containing result cards
 * with "Show more" / "Show fewer" pagination controls.
 *
 * Intended to be rendered inside a `<Suspense>` boundary (see
 * `app/search/page.tsx`) with {@link ResultsSkeleton} as the fallback.
 *
 * @param {ResultsProps}  props      - Component props.
 * @param {string}       [props.term] - The search term to display and query.
 * @returns {Promise<JSX.Element>} The rendered search results list.
 *
 * @example
 * <Suspense fallback={<ResultsSkeleton />}>
 *   <Results term="gaming" />
 * </Suspense>
 */
export async function Results({ term }: ResultsProps) {
  const { items: data, nextCursor } = await getSearch(term);

  return (
    <div>
      {/* Heading reflects the active search term */}
      <h2 className="mb-4 text-lg font-semibold">
        Results for term &quot;{term}&quot;
      </h2>

      {/* Empty state: shown when the query returns no matching streams */}
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No results found. Try searching for something else
        </p>
      ) : (
        <ResultsList
          key={term}
          initialCursor={nextCursor}
          initialItems={data}
          term={term}
        />
      )}
    </div>
  );
}

/**
 * ResultsSkeleton component - Animated loading placeholder for {@link Results}.
 *
 * Renders a skeleton heading block followed by four {@link ResultCardSkeleton}
 * placeholders, mirroring the layout of the populated {@link Results}
 * component while data is being fetched.
 *
 * @returns {JSX.Element} An animated skeleton placeholder for the results list.
 *
 * @example
 * <Suspense fallback={<ResultsSkeleton />}>
 *   <Results term="gaming" />
 * </Suspense>
 */
export function ResultsSkeleton() {
  return (
    <div>
      {/* Heading placeholder — matches the width/height of the results heading */}
      <Skeleton className="mb-4 h-8 w-72.5" />

      {/* Render four card skeletons to fill the anticipated results layout */}
      <div className="flex flex-col gap-y-4">
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
