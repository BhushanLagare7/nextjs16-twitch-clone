/**
 * @file Tooltip UI primitives built on top of Radix UI's Tooltip component.
 * Provides composable, accessible tooltip components with consistent
 * styling and animation for use throughout the application.
 *
 * Exports:
 * - `TooltipProvider`: Context provider for tooltip configuration.
 * - `Tooltip`: Root tooltip component.
 * - `TooltipTrigger`: The element that triggers the tooltip.
 * - `TooltipContent`: The styled tooltip content panel.
 */

"use client";

import * as React from "react";

import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * TooltipProvider Component
 *
 * Wraps a section of the component tree to provide shared tooltip context,
 * including configuration options like `delayDuration`.
 * Should wrap any part of the tree that uses `Tooltip` components.
 *
 * @param {React.ComponentProps<typeof TooltipPrimitive.Provider>} props
 *   All props from Radix UI's `Tooltip.Provider`.
 * @param {number} [props.delayDuration=0] - Delay in milliseconds before
 *   the tooltip appears after the trigger is hovered/focused.
 * @returns {JSX.Element} A Radix UI Tooltip.Provider element.
 *
 * @example
 * <TooltipProvider delayDuration={200}>
 *   <App />
 * </TooltipProvider>
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * Tooltip Component
 *
 * The root wrapper for a tooltip. Manages open/close state for
 * the tooltip and coordinates its trigger and content.
 *
 * @param {React.ComponentProps<typeof TooltipPrimitive.Root>} props
 *   All props from Radix UI's `Tooltip.Root` (e.g., `open`, `defaultOpen`, `onOpenChange`).
 * @returns {JSX.Element} A Radix UI Tooltip.Root element.
 *
 * @example
 * <Tooltip>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>Tooltip text</TooltipContent>
 * </Tooltip>
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/**
 * TooltipTrigger Component
 *
 * The element that, when hovered or focused, shows the tooltip content.
 * Accepts an `asChild` prop to render as a custom element instead of
 * its default wrapper.
 *
 * @param {React.ComponentProps<typeof TooltipPrimitive.Trigger>} props
 *   All props from Radix UI's `Tooltip.Trigger` (e.g., `asChild`).
 * @returns {JSX.Element} A Radix UI Tooltip.Trigger element.
 *
 * @example
 * <TooltipTrigger asChild>
 *   <Button>Hover me</Button>
 * </TooltipTrigger>
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * TooltipContent Component
 *
 * The styled content panel displayed when the tooltip is active.
 * Renders inside a Radix UI `Portal` to avoid z-index and overflow issues.
 * Includes:
 * - Animated entrance/exit based on tooltip state and placement side.
 * - A small arrow indicator pointing toward the trigger.
 * - Customizable positioning via `sideOffset`.
 *
 * @param {React.ComponentProps<typeof TooltipPrimitive.Content>} props
 *   All props from Radix UI's `Tooltip.Content`.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {number} [props.sideOffset=0] - Distance in pixels between the
 *   tooltip content and the trigger element.
 * @param {React.ReactNode} props.children - Content to render inside the tooltip.
 * @returns {JSX.Element} A portaled, styled Radix UI Tooltip.Content element.
 *
 * @example
 * <TooltipContent side="right" sideOffset={8}>
 *   <p>Helpful tooltip text</p>
 * </TooltipContent>
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    /* Portal: Renders tooltip outside the DOM hierarchy to avoid clipping/overflow issues */
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          // Base layout and appearance
          "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background",
          // Keyboard shortcut slot adjustments
          "has-data-[slot=kbd]:pr-1.5",
          // Slide-in animations based on which side the tooltip appears
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Nested keyboard shortcut element styling
          "**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
          // Open/close animation states
          "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        {children}

        {/* Small rotated square that forms the tooltip's directional arrow */}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
