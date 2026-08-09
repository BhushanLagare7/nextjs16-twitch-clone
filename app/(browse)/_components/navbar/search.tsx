/**
 * @file search.tsx
 * @description Search component that provides a search input form for
 * querying content across the application.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SearchIcon, XIcon } from "lucide-react";
import qs from "query-string";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Search component that renders a search form with clear and submit functionality.
 * Navigates to the search results page with the query term as a URL parameter.
 *
 * @component
 * @example
 * // Basic usage within the Navbar
 * <Search />
 *
 * @remarks
 * - This is a client component that manages its own local state
 * - On submission, navigates to `/search?term={value}`
 * - Empty submissions are ignored to prevent unnecessary navigation
 * - Displays a clear (×) button when the input field has a value
 * - Uses `query-string` library for URL serialization
 * - Skips empty string parameters in the generated URL
 * - Full width on mobile, fixed width (lg:w-100) on large screens
 *
 * @returns {JSX.Element} A search form with an input field, clear button,
 * and search submit button
 */
export function Search() {
  const router = useRouter();

  /** The current value of the search input field */
  const [value, setValue] = useState("");

  /**
   * Handles the form submission event.
   * Constructs a URL with the search term as a query parameter
   * and navigates to the search results page.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {void}
   *
   * @remarks
   * - Prevents the default form submission behavior
   * - Ignores empty input values and returns early
   * - Uses `query-string` to safely serialize the URL with the search term
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) return;

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: { term: value },
      },
      { skipEmptyString: true },
    );

    router.push(url);
  };

  /**
   * Clears the current search input value by resetting the state to
   * an empty string.
   *
   * @returns {void}
   */
  const onClear = () => {
    setValue("");
  };

  return (
    <form
      className="relative flex w-full items-center lg:w-100"
      onSubmit={onSubmit}
    >
      {/* Search text input - right border removed to visually merge with submit button */}
      <Input
        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* Clear button - only visible when the input has a value */}
      {value && (
        <XIcon
          className="absolute top-2.5 right-14 size-5 cursor-pointer text-muted-foreground transition hover:opacity-75"
          onClick={onClear}
        />
      )}
      {/* Search submit button - left border removed to visually merge with input */}
      <Button
        className="rounded-l-none"
        size="sm"
        type="submit"
        variant="secondary"
      >
        <SearchIcon className="size-5 text-muted-foreground" />
      </Button>
    </form>
  );
}
