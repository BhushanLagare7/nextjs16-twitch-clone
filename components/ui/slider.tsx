"use client";

import * as React from "react";

import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Styled wrapper around Radix UI's `Slider` primitive.
 *
 * Supports both controlled (`value`) and uncontrolled (`defaultValue`)
 * usage, single or multiple thumbs (one thumb is rendered per value in
 * `value`/`defaultValue`), and horizontal or vertical orientation via
 * Radix's `orientation` prop.
 *
 * @function Slider
 *
 * @param {React.ComponentProps<typeof SliderPrimitive.Root>} props - All
 *   props are forwarded to Radix's `Slider.Root`.
 * @param {string} [props.className] - Additional classes merged onto the
 *   root element.
 * @param {number[]} [props.defaultValue] - Initial value(s) for
 *   uncontrolled usage.
 * @param {number[]} [props.value] - Current value(s) for controlled usage.
 * @param {number} [props.min=0] - Minimum slider value.
 * @param {number} [props.max=100] - Maximum slider value.
 *
 * @returns {JSX.Element} A styled slider with a track, filled range, and
 *   one thumb per value.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // Fall back to [min, max] (a two-thumb range) when neither `value` nor
  // `defaultValue` is provided, so at least one thumb always renders.
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>
      {/* Render one thumb per value (supports single or range sliders). */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          data-slot="slider-thumb"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
