"use client";

import * as React from "react";

import { Separator as SeparatorPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * A styled separator component built on top of the Radix UI `Separator` primitive.
 *
 * - Renders a thin visual divider, either horizontal or vertical.
 * - Defaults to `horizontal` orientation and is decorative (hidden from
 *   the accessibility tree) by default.
 * - Supports all props of the underlying Radix UI `Separator.Root` component.
 *
 * @param props - Props passed to the underlying Radix UI `Separator.Root`.
 * @param props.className - Additional CSS classes to apply.
 * @param props.orientation - The orientation of the separator (`"horizontal"` or `"vertical"`).
 *   Defaults to `"horizontal"`.
 * @param props.decorative - Whether the separator is purely decorative (i.e., hidden from
 *   assistive technologies). Defaults to `true`.
 * @returns A styled separator element.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/separator
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
