/**
 * @file utils.ts
 * @description Shared utility helpers used across the application.
 *
 * @module lib/utils
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names safely, resolving conflicts intelligently.
 *
 * Combines two libraries:
 * - **`clsx`** — Conditionally joins class names, accepting strings, arrays,
 *   objects (`{ "text-red-500": isError }`), and falsy values (which are ignored).
 * - **`tailwind-merge`** (`twMerge`) — Deduplicates and resolves conflicting
 *   Tailwind utility classes so that the last class always wins, preventing
 *   specificity bugs caused by class order in the stylesheet.
 *
 * This is the standard pattern for merging Tailwind classes in component
 * libraries (e.g. shadcn/ui) because raw string concatenation or `clsx` alone
 * cannot resolve conflicts like `"px-2 px-4"` → should produce `"px-4"`.
 *
 * ---
 * @param {...ClassValue[]} inputs - Any number of class values accepted by `clsx`:
 *   strings, numbers, arrays, objects, `undefined`, `null`, or `false`
 *   (falsy values are safely ignored).
 *
 * @returns {string} A single, deduplicated, conflict-resolved class string
 *   ready to be passed to a `className` prop.
 *
 * ---
 * @example
 * // Basic string merging
 * cn("px-2 py-1", "px-4");
 * // → "py-1 px-4"  (`px-2` is overridden by `px-4`)
 *
 * @example
 * // Conditional classes via object syntax
 * cn("btn", { "btn-disabled": isDisabled, "btn-primary": isPrimary });
 * // → "btn btn-primary"  (when `isDisabled` is false, `isPrimary` is true)
 *
 * @example
 * // Consumer overrides in a component
 * function Card({ className }: { className?: string }) {
 *   return <div className={cn("rounded-md bg-white p-4", className)} />;
 * }
 *
 * // Consumer passes "bg-gray-100 p-6" — both conflicts resolve correctly:
 * // → "rounded-md p-6 bg-gray-100"
 *
 * @see {@link https://github.com/lukeed/clsx | clsx}
 * @see {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * A curated, contrast-safe palette of colors providing WCAG AA compliant
 * contrast (≥ 4.5:1) for inline text on light backgrounds while remaining
 * distinct and readable on dark themes.
 */
const CONTRAST_SAFE_COLORS = [
  "#1D4ED8", // Blue 700
  "#B45309", // Amber 700
  "#047857", // Emerald 700
  "#B91C1C", // Red 700
  "#6D28D9", // Violet 700
  "#BE185D", // Pink 700
  "#0E7490", // Cyan 700
  "#4338CA", // Indigo 700
  "#C2410C", // Orange 700
  "#15803D", // Green 700
  "#7E22CE", // Purple 700
  "#A21CAF", // Fuchsia 700
  "#0369A1", // Sky 700
  "#BE123C", // Rose 700
  "#0F766E", // Teal 700
];

/**
 * Deterministically derives a hex color string from an arbitrary input
 * string, so the same input (e.g. a username) always maps to the same
 * color across renders.
 *
 * Uses a bitwise hash of the string to select a color from a curated,
 * contrast-safe palette that guarantees sufficient contrast across themes
 * without requiring DOM or theme state access.
 *
 * @param {string} str - The input string to derive a color from (e.g. a
 *   chat participant's display name). An empty string is accepted and
 *   will produce a deterministic color.
 *
 * @returns {string} A hex color string in the form `"#rrggbb"`.
 *
 * @example
 * stringToColor("Alice"); // → "#BE123C"
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % CONTRAST_SAFE_COLORS.length);
  return CONTRAST_SAFE_COLORS[index];
}
