/**
 * @file components/ui/select.tsx
 * @description Accessible and styled select (dropdown) components built on top
 * of Radix UI's Select primitive.
 *
 * Components:
 * - `Select`                — Root select state manager.
 * - `SelectGroup`           — Groups related select items.
 * - `SelectValue`           — Displays the currently selected value.
 * - `SelectTrigger`         — Button that opens the dropdown.
 * - `SelectContent`         — Dropdown content container.
 * - `SelectLabel`           — Label for a group of select items.
 * - `SelectItem`            — Individual selectable option.
 * - `SelectSeparator`       — Visual divider between select items or groups.
 * - `SelectScrollUpButton`  — Button to scroll up within the dropdown list.
 * - `SelectScrollDownButton`— Button to scroll down within the dropdown list.
 */

"use client";

import * as React from "react";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Select - Root component that manages the open/close state of the dropdown.
 *
 * Wraps Radix UI's `Select.Root` with a `data-slot` attribute.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Root>} props
 * @returns {JSX.Element} The select root component.
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

/**
 * SelectGroup - Groups related select items together.
 *
 * Wraps Radix UI's `Select.Group` with padding and scroll margin for alignment.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Group>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} A grouped container for select items.
 */
function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      className={cn("scroll-my-1 p-1", className)}
      data-slot="select-group"
      {...props}
    />
  );
}

/**
 * SelectValue - Renders the currently selected value inside the trigger.
 *
 * Wraps Radix UI's `Select.Value` with a `data-slot` attribute.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Value>} props
 * @returns {JSX.Element} The displayed selected value.
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/**
 * SelectTrigger - The button element that toggles the select dropdown open/closed.
 *
 * Includes focus, disabled, and invalid states, and appends a `ChevronDownIcon`.
 * Supports two sizes: `"default"` (h-9) and `"sm"` (h-8).
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" }} props
 * @param {string} [props.className] - Additional CSS classes.
 * @param {"sm" | "default"} [props.size="default"] - Size variant of the trigger.
 * @param {React.ReactNode} props.children - Content inside the trigger (typically `SelectValue`).
 * @returns {JSX.Element} The select trigger button.
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-size={size}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      {/* Dropdown chevron icon */}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * SelectContent - The dropdown panel containing select items.
 *
 * Rendered inside a portal and supports `"item-aligned"` (default) and
 * `"popper"` positioning strategies with entrance/exit animations.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Content>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Select items or groups to render.
 * @param {"item-aligned" | "popper"} [props.position="item-aligned"] - Positioning strategy.
 * @param {"start" | "center" | "end"} [props.align="center"] - Horizontal alignment.
 * @returns {JSX.Element} The dropdown content container.
 */
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        align={align}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        data-align-trigger={position === "item-aligned"}
        data-slot="select-content"
        position={position}
        {...props}
      >
        {/* Scroll up button shown when content overflows */}
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && "",
          )}
          data-position={position}
        >
          {children}
        </SelectPrimitive.Viewport>
        {/* Scroll down button shown when content overflows */}
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * SelectLabel - A non-interactive label for a group of select items.
 *
 * Styled with muted foreground text at a smaller font size.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Label>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The select group label.
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      data-slot="select-label"
      {...props}
    />
  );
}

/**
 * SelectItem - An individual selectable option within the dropdown.
 *
 * Displays a `CheckIcon` on the right side when the item is selected.
 * Supports focus highlighting and disabled states.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Item>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - The label content for this option.
 * @returns {JSX.Element} A selectable dropdown item.
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      data-slot="select-item"
      {...props}
    >
      {/* Check icon indicator shown when this item is selected */}
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/**
 * SelectSeparator - A horizontal visual divider between select items or groups.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.Separator>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} A styled separator line.
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      data-slot="select-separator"
      {...props}
    />
  );
}

/**
 * SelectScrollUpButton - A button that appears at the top of the dropdown
 * when the list can be scrolled upward.
 *
 * Displays a `ChevronUpIcon` to indicate scroll direction.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The scroll-up button.
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * SelectScrollDownButton - A button that appears at the bottom of the dropdown
 * when the list can be scrolled downward.
 *
 * Displays a `ChevronDownIcon` to indicate scroll direction.
 *
 * @param {React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The scroll-down button.
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
