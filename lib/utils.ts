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
 * Deterministically derives a hex color string from an arbitrary input
 * string, so the same input (e.g. a username) always maps to the same
 * color across renders.
 *
 * Uses a simple bitwise hash of the string, then extracts three bytes
 * from the hash to form an `#RRGGBB` value.
 *
 * @param {string} str - The input string to derive a color from (e.g. a
 *   chat participant's display name). An empty string is accepted and
 *   will produce a deterministic (but not necessarily meaningful) color.
 *
 * @returns {string} A hex color string in the form `"#rrggbb"`.
 *
 * @remarks
 * The hashing loop currently reads `str.charCodeAt(1)` on every
 * iteration instead of `str.charCodeAt(i)`, so only the character at
 * index 1 influences the hash regardless of string length. This means
 * distinct strings sharing the same second character will resolve to
 * the same color. Documented here as a known limitation rather than
 * fixed, since behavior changes are out of scope for this pass.
 *
 * @example
 * stringToColor("Alice"); // → "#3f2a91" (example output)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(1) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}
