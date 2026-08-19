/**
 * @file app/(browse)/search/_components/results-list.tsx
 * @description Interactive client component for rendering search results with
 * "Show more" and "Show fewer" pagination controls.
 *
 * @module ResultsList
 */

"use client";

import { useState, useTransition } from "react";

import { ChevronDownIcon, ChevronUpIcon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";

import { getMoreSearchResults } from "@/actions/search";
import { Button } from "@/components/ui/button";
import { Stream, User } from "@/generated/prisma";

import { ResultCard } from "./result-card";

/**
 * A single search result item containing stream data joined with a
 * narrowed user payload (only public-facing fields).
 */
type SearchResultItem = Pick<
  Stream,
  "id" | "name" | "isLive" | "thumbnailUrl" | "updatedAt"
> & {
  user: Pick<User, "username" | "imageUrl">;
};

/**
 * Props for the {@link ResultsList} component.
 *
 * @interface ResultsListProps
 * @property {SearchResultItem[]} initialItems  - The initial page of search results.
 * @property {string | null}      initialCursor - Cursor ID to fetch the next page, or null if no more.
 * @property {string}             [term]        - Active search query term.
 */
interface ResultsListProps {
  initialItems: SearchResultItem[];
  initialCursor: string | null;
  term?: string;
}

/**
 * ResultsList component - Renders the stream result cards with show more / show fewer controls.
 *
 * Manages incremental loading using the cursor-based search API and provides
 * buttons to paginate forward or collapse back to the default initial result set.
 *
 * @param {ResultsListProps} props - Component props.
 * @returns {JSX.Element} The rendered results list and pagination controls.
 */
export function ResultsList({
  initialItems,
  initialCursor,
  term,
}: ResultsListProps) {
  const [items, setItems] = useState<SearchResultItem[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isPending, startTransition] = useTransition();

  /**
   * Fetches the next page of search results and appends them to the current list.
   * No-ops if there is no available cursor or a fetch is already in progress.
   */
  const handleShowMore = () => {
    if (!cursor || isPending) return;

    startTransition(async () => {
      try {
        const response = await getMoreSearchResults(term, cursor);
        setItems((prev) => [...prev, ...response.items]);
        setCursor(response.nextCursor);
      } catch {
        toast.error("Failed to load more results");
      }
    });
  };

  /**
   * Resets the displayed results back to the initial default limit and
   * restores the original cursor so "Show more" can be used again.
   */
  const handleShowFewer = () => {
    setItems(initialItems);
    setCursor(initialCursor);
  };

  /** True when the result set has grown beyond the server-rendered initial page. */
  const hasExceededDefault =
    initialCursor !== null || items.length > initialItems.length;

  /** True when there are more pages available to fetch from the server. */
  const canShowMore = cursor !== null;

  /** True when the client has loaded additional pages beyond the initial set. */
  const canShowFewer = items.length > initialItems.length;

  return (
    <div className="flex flex-col gap-y-4">
      {/* Stream results list */}
      <div className="flex flex-col gap-y-4">
        {items.map((result) => (
          <ResultCard key={result.id} data={result} />
        ))}
      </div>

      {/* Pagination controls when results exceed the default limit */}
      {hasExceededDefault && (
        <div className="flex items-center justify-center gap-x-4 pt-4">
          {canShowMore && (
            <Button
              disabled={isPending}
              variant="secondary"
              onClick={handleShowMore}
            >
              {isPending ? (
                <LoaderIcon className="mr-2 size-4 animate-spin" />
              ) : (
                <ChevronDownIcon className="mr-2 size-4" />
              )}
              Show more
            </Button>
          )}

          {canShowFewer && (
            <Button
              disabled={isPending}
              variant="outline"
              onClick={handleShowFewer}
            >
              <ChevronUpIcon className="mr-2 size-4" />
              Show fewer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
