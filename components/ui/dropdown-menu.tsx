/**
 * @file Dropdown Menu component built on top of Radix UI's DropdownMenu primitive.
 *
 * Provides a fully accessible, composable dropdown menu system with support for:
 * - Basic menu items with optional destructive variant
 * - Checkbox and radio group items
 * - Nested submenus
 * - Keyboard shortcuts display
 * - Section labels and separators
 * - Animated open/close transitions
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/dropdown-menu} Radix UI Dropdown Menu
 */

"use client";

import * as React from "react";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Root dropdown menu component that manages the open/closed state.
 * Wraps Radix UI's `DropdownMenu.Root` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Root>} props - Props passed to the Radix UI DropdownMenu root.
 * @returns {React.JSX.Element} The root dropdown menu component.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Portal wrapper that renders dropdown menu content outside the DOM hierarchy.
 * Useful for avoiding overflow or z-index issues.
 * Wraps Radix UI's `DropdownMenu.Portal` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Portal>} props - Props passed to the Radix UI DropdownMenu portal.
 * @returns {React.JSX.Element} The portal wrapper component.
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

/**
 * Trigger element that toggles the dropdown menu open/closed state.
 * Wraps Radix UI's `DropdownMenu.Trigger` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>} props - Props passed to the Radix UI DropdownMenu trigger.
 * @returns {React.JSX.Element} The trigger component.
 *
 * @example
 * <DropdownMenuTrigger>
 *   <Button>Open</Button>
 * </DropdownMenuTrigger>
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

/**
 * Container for the dropdown menu items and content.
 * Renders inside a portal with animations and positioning relative to the trigger.
 * Wraps Radix UI's `DropdownMenu.Content` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Content>} props - Props passed to the Radix UI DropdownMenu content.
 * @param {string} [props.className] - Additional CSS classes to apply to the content container.
 * @param {"start" | "center" | "end"} [props.align="start"] - Alignment of the content relative to the trigger.
 * @param {number} [props.sideOffset=4] - Distance in pixels between the trigger and content.
 * @returns {React.JSX.Element} The dropdown content container.
 *
 * @example
 * <DropdownMenuContent align="end" sideOffset={8}>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 * </DropdownMenuContent>
 */
function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Groups related dropdown menu items together.
 * Wraps Radix UI's `DropdownMenu.Group` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Group>} props - Props passed to the Radix UI DropdownMenu group.
 * @returns {React.JSX.Element} The group wrapper component.
 *
 * @example
 * <DropdownMenuGroup>
 *   <DropdownMenuLabel>Account</DropdownMenuLabel>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 * </DropdownMenuGroup>
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

/**
 * A single interactive item within the dropdown menu.
 * Supports a destructive variant for dangerous actions (e.g., delete).
 * Wraps Radix UI's `DropdownMenu.Item` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Item>} props - Props passed to the Radix UI DropdownMenu item.
 * @param {string} [props.className] - Additional CSS classes to apply to the item.
 * @param {boolean} [props.inset] - If true, adds left padding to align with items that have icons.
 * @param {"default" | "destructive"} [props.variant="default"] - Visual style of the menu item.
 *   Use `"destructive"` for actions like delete or remove.
 * @returns {React.JSX.Element} The menu item component.
 *
 * @example
 * // Default item
 * <DropdownMenuItem>Edit</DropdownMenuItem>
 *
 * // Destructive item
 * <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
 *
 * // Inset item (aligned with icon items)
 * <DropdownMenuItem inset>Settings</DropdownMenuItem>
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  /** If true, adds left padding to align with items that have icons. */
  inset?: boolean;
  /** Visual style variant. Use `"destructive"` for dangerous actions. */
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * A menu item with a checkbox indicator for toggling boolean states.
 * Displays a checkmark icon when the item is checked.
 * Wraps Radix UI's `DropdownMenu.CheckboxItem` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>} props - Props passed to the Radix UI DropdownMenu checkbox item.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.ReactNode} props.children - Content of the checkbox item.
 * @param {boolean} [props.checked] - Whether the checkbox is checked.
 * @param {boolean} [props.inset] - If true, adds left padding to align with icon items.
 * @returns {React.JSX.Element} The checkbox menu item component.
 *
 * @example
 * <DropdownMenuCheckboxItem checked={isChecked} onCheckedChange={setIsChecked}>
 *   Show Toolbar
 * </DropdownMenuCheckboxItem>
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  /** If true, adds left padding to align with items that have icons. */
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      {/* Checkmark indicator displayed when the item is checked */}
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * A group container for radio items, ensuring only one item can be selected at a time.
 * Wraps Radix UI's `DropdownMenu.RadioGroup` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>} props - Props passed to the Radix UI DropdownMenu radio group.
 * @returns {React.JSX.Element} The radio group component.
 *
 * @example
 * <DropdownMenuRadioGroup value={selectedValue} onValueChange={setSelectedValue}>
 *   <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/**
 * A menu item that functions as a radio button within a `DropdownMenuRadioGroup`.
 * Displays a checkmark icon when selected.
 * Wraps Radix UI's `DropdownMenu.RadioItem` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>} props - Props passed to the Radix UI DropdownMenu radio item.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.ReactNode} props.children - Content of the radio item.
 * @param {boolean} [props.inset] - If true, adds left padding to align with icon items.
 * @returns {React.JSX.Element} The radio menu item component.
 *
 * @example
 * <DropdownMenuRadioItem value="dark">Dark Mode</DropdownMenuRadioItem>
 */
function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  /** If true, adds left padding to align with items that have icons. */
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      {/* Checkmark indicator displayed when this radio item is selected */}
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/**
 * A non-interactive label used to describe a group of related menu items.
 * Wraps Radix UI's `DropdownMenu.Label` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Label>} props - Props passed to the Radix UI DropdownMenu label.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {boolean} [props.inset] - If true, adds left padding to align with icon items.
 * @returns {React.JSX.Element} The label component.
 *
 * @example
 * <DropdownMenuLabel>My Account</DropdownMenuLabel>
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  /** If true, adds left padding to align with items that have icons. */
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

/**
 * A visual divider that separates groups of menu items.
 * Wraps Radix UI's `DropdownMenu.Separator` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Separator>} props - Props passed to the Radix UI DropdownMenu separator.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {React.JSX.Element} The separator component.
 *
 * @example
 * <DropdownMenuItem>Profile</DropdownMenuItem>
 * <DropdownMenuSeparator />
 * <DropdownMenuItem>Logout</DropdownMenuItem>
 */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

/**
 * Displays a keyboard shortcut hint aligned to the right side of a menu item.
 * Intended to be used as a child of `DropdownMenuItem`.
 *
 * @param {React.ComponentProps<"span">} props - Standard HTML span element props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {React.JSX.Element} The shortcut hint component.
 *
 * @example
 * <DropdownMenuItem>
 *   Copy <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
 * </DropdownMenuItem>
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className,
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

/**
 * Root component for a nested submenu within the dropdown menu.
 * Manages the open/closed state of the submenu.
 * Wraps Radix UI's `DropdownMenu.Sub` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Sub>} props - Props passed to the Radix UI DropdownMenu sub.
 * @returns {React.JSX.Element} The submenu root component.
 *
 * @example
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Sub Item</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Trigger element that opens a nested submenu.
 * Automatically renders a chevron icon indicating the presence of a submenu.
 * Wraps Radix UI's `DropdownMenu.SubTrigger` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>} props - Props passed to the Radix UI DropdownMenu sub trigger.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {boolean} [props.inset] - If true, adds left padding to align with icon items.
 * @param {React.ReactNode} props.children - Content of the submenu trigger.
 * @returns {React.JSX.Element} The submenu trigger component.
 *
 * @example
 * <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  /** If true, adds left padding to align with items that have icons. */
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      {/* Chevron icon indicating that this item opens a submenu */}
      <ChevronRightIcon className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * Container for the nested submenu's content and items.
 * Renders with animations and elevated shadow to distinguish from the parent menu.
 * Wraps Radix UI's `DropdownMenu.SubContent` primitive.
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>} props - Props passed to the Radix UI DropdownMenu sub content.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {React.JSX.Element} The submenu content container.
 *
 * @example
 * <DropdownMenuSubContent>
 *   <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *   <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 * </DropdownMenuSubContent>
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-24 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className,
      )}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
