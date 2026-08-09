/**
 * @file Skeleton UI primitive for displaying animated loading placeholders.
 * Used throughout the application to indicate content that is still loading.
 */

import { cn } from "@/lib/utils";

/**
 * Skeleton Component
 *
 * A generic animated placeholder element used to represent loading content.
 * Renders a pulsing rounded rectangle styled with the `muted` background color.
 *
 * Sizing and shape are fully controlled via the `className` prop, making it
 * adaptable for text lines, avatars, cards, and other UI shapes.
 *
 * @param {React.ComponentProps<"div">} props - Standard HTML `<div>` props.
 *   Use `className` to control width, height, and border-radius.
 * @returns {JSX.Element} An animated skeleton placeholder `<div>`.
 *
 * @example
 * // Text line placeholder
 * <Skeleton className="h-4 w-48" />
 *
 * @example
 * // Circular avatar placeholder
 * <Skeleton className="h-10 w-10 rounded-full" />
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
