/**
 * @file components/ui/textarea.tsx
 * @description Reusable, accessible `<textarea>` primitive built on top of
 * the native HTML element.
 *
 * Applies a consistent set of Tailwind utility classes for sizing, borders,
 * focus rings, disabled states, and ARIA-invalid error styling (including
 * dark-mode variants). All standard `<textarea>` HTML attributes are
 * forwarded directly to the underlying element via the spread operator,
 * making this a drop-in replacement wherever a styled textarea is needed.
 *
 * @module Textarea
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Styled textarea component that forwards all native `<textarea>` props.
 *
 * Behaviour highlights:
 * - **Auto-sizing** — uses `field-sizing-content` to grow with its content,
 *   with a minimum height of `min-h-16`.
 * - **Focus ring** — a three-unit ring in the theme's `ring` colour is
 *   applied on `:focus-visible` for keyboard accessibility.
 * - **Error state** — when `aria-invalid="true"` is set, the border and
 *   focus ring switch to the `destructive` colour token. Dark-mode variants
 *   use reduced-opacity versions of the same tokens.
 * - **Disabled state** — renders a `not-allowed` cursor and 50 % opacity
 *   when the `disabled` attribute is present.
 *
 * A `data-slot="textarea"` attribute is applied to the root element to
 * allow parent components to target it with the `[&_[data-slot=textarea]]`
 * Tailwind selector pattern.
 *
 * @function Textarea
 *
 * @param {React.ComponentProps<"textarea">} props - All standard HTML
 *   `<textarea>` attributes, plus an optional `className` that is merged
 *   with the default styles via {@link cn}.
 *
 * @returns {JSX.Element} A styled `<textarea>` element.
 *
 * @example
 * // Basic usage
 * <Textarea placeholder="Enter your bio…" />
 *
 * @example
 * // Disabled and pre-filled
 * <Textarea disabled value="Read-only content" />
 *
 * @example
 * // With error state for form validation
 * <Textarea aria-invalid="true" />
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
