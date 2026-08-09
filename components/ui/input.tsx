/**
 * @file input.tsx
 * @description A reusable, accessible, and styled HTML input component built
 * with Tailwind CSS and utility class merging via `cn`.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input component that renders a styled HTML `<input>` element.
 * Extends all native HTML input props with additional Tailwind CSS styling.
 *
 * @component
 * @example
 * // Basic text input
 * <Input placeholder="Enter your name" />
 *
 * @example
 * // Password input with a custom class
 * <Input type="password" className="border-red-500" placeholder="Password" />
 *
 * @example
 * // Controlled input with change handler
 * <Input
 *   value={inputValue}
 *   onChange={(e) => setInputValue(e.target.value)}
 *   placeholder="Search..."
 * />
 *
 * @remarks
 * **Styling features:**
 * - Rounded border with a consistent height (h-9)
 * - Responsive text size (base on mobile, sm on md+)
 * - Ring-based focus indicator for accessibility
 * - Transparent background with optional dark mode input tint
 *
 * **State styles:**
 * - `disabled`: Reduced opacity, no pointer events, and a not-allowed cursor
 * - `aria-invalid`: Destructive color border and ring to signal validation errors
 * - `focus-visible`: Highlighted ring for keyboard navigation accessibility
 *
 * @param {React.ComponentProps<"input">} props - All standard HTML input attributes
 * @param {string} [props.className] - Additional Tailwind CSS classes to merge
 * @param {string} [props.type] - The type of the input (e.g., "text", "password", "email")
 *
 * @returns {JSX.Element} A styled and accessible HTML input element
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        // Base layout and sizing
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1",
        // Typography and transitions
        "text-base shadow-xs transition-[color,box-shadow] outline-none",
        // File input styles
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Placeholder styling
        "placeholder:text-muted-foreground",
        // Focus-visible ring for keyboard accessibility
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        // Disabled state styles
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Invalid/error state styles (light mode)
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        // Responsive text size
        "md:text-sm",
        // Dark mode overrides
        "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
