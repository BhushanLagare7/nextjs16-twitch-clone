"use client";

import * as React from "react";

import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * A styled label component built on top of the Radix UI `Label` primitive.
 *
 * - Applies consistent typography and spacing styles.
 * - Automatically handles disabled states for associated form controls:
 *   - Disables pointer events and reduces opacity when the parent group
 *     has `data-disabled="true"`.
 *   - Shows a `not-allowed` cursor and reduced opacity when the associated
 *     peer input is disabled.
 * - Supports all props of the underlying Radix UI `Label.Root` component.
 *
 * @param props - Props passed to the underlying Radix UI `Label.Root`,
 *   including `className` and any valid label attributes.
 * @returns A styled label element.
 *
 * @see https://www.radix-ui.com/primitives/docs/components/label
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
