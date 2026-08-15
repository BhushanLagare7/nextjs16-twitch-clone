/**
 * @file components/ui/scroll-area.tsx
 * @description Styled wrapper around Radix UI's `ScrollArea` primitive,
 * providing a custom scrollbar/thumb and consistent focus styling.
 *
 * @module ScrollArea
 */

"use client";

import * as React from "react";

import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Scrollable container with a custom-styled scrollbar.
 *
 * Wraps Radix's `ScrollArea.Root`/`Viewport`/`Corner` and renders a
 * {@link ScrollBar} for the vertical axis by default.
 *
 * @function ScrollArea
 * @param {React.ComponentProps<typeof ScrollAreaPrimitive.Root>} props -
 *   All props are forwarded to `ScrollAreaPrimitive.Root`; `children` are
 *   rendered inside the scrollable viewport.
 * @returns {JSX.Element} The scrollable container.
 */
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative", className)}
      data-slot="scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * Custom scrollbar/thumb rendered inside {@link ScrollArea}.
 *
 * @function ScrollBar
 * @param {React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>} props -
 *   All props are forwarded to `ScrollAreaPrimitive.ScrollAreaScrollbar`.
 * @param {"vertical" | "horizontal"} [props.orientation="vertical"] - Axis
 *   the scrollbar controls.
 * @returns {JSX.Element} The scrollbar element with its thumb.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className,
      )}
      data-orientation={orientation}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className="relative flex-1 rounded-full bg-border"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
