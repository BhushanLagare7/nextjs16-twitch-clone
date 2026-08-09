/**
 * @file Avatar UI primitives built on top of Radix UI's Avatar component.
 *
 * Exports the following composable components:
 * - `Avatar`: The root container with size variants and a subtle inset border overlay.
 * - `AvatarImage`: The user's profile image, covering the full avatar circle.
 * - `AvatarFallback`: Displayed when the image is unavailable; shows initials or a placeholder.
 * - `AvatarBadge`: A small status indicator badge anchored to the bottom-right of the avatar.
 * - `AvatarGroup`: A container that stacks multiple avatars with overlapping rings.
 * - `AvatarGroupCount`: A count indicator used inside `AvatarGroup` to show overflow count.
 */

"use client";

import * as React from "react";

import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Avatar Component
 *
 * The root container for an avatar. Renders a circular element with an inset
 * border overlay via a CSS `::after` pseudo-element that adapts to dark mode.
 *
 * Size is controlled via the `size` prop and reflected as a `data-size` attribute
 * for CSS targeting by child components.
 *
 * @param props - Standard Radix UI `AvatarPrimitive.Root` props, plus:
 * @param {("default" | "sm" | "lg")} [props.size="default"] - Controls the avatar's dimensions.
 *   - `"default"`: 32×32px
 *   - `"sm"`: 24×24px
 *   - `"lg"`: 40×40px
 * @returns {JSX.Element} A circular avatar root container.
 *
 * @example
 * <Avatar size="lg">
 *   <AvatarImage src="/avatar.jpg" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */
function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      data-size={size}
      data-slot="avatar"
      {...props}
    />
  );
}

/**
 * AvatarImage Component
 *
 * Renders the user's profile image inside the `Avatar` container.
 * The image is cropped to cover the full circular area via `object-cover`.
 * Automatically hidden by Radix UI if the image fails to load,
 * allowing `AvatarFallback` to display instead.
 *
 * @param props - Standard Radix UI `AvatarPrimitive.Image` props.
 * @returns {JSX.Element} A circular profile image.
 *
 * @example
 * <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      data-slot="avatar-image"
      {...props}
    />
  );
}

/**
 * AvatarFallback Component
 *
 * Displayed inside the `Avatar` when the `AvatarImage` fails to load
 * or while the image is still loading. Typically renders the user's initials.
 *
 * Font size adapts to the avatar's size variant:
 * - `"sm"`: `text-xs`
 * - `"default"` / `"lg"`: `text-sm`
 *
 * @param props - Standard Radix UI `AvatarPrimitive.Fallback` props.
 * @returns {JSX.Element} A centered fallback element within the avatar circle.
 *
 * @example
 * <AvatarFallback>JD</AvatarFallback>
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

/**
 * AvatarBadge Component
 *
 * A small status indicator badge anchored to the bottom-right corner of an `Avatar`.
 * Renders as a filled circle with a ring to visually separate it from the avatar background.
 *
 * Badge size scales automatically based on the parent avatar's `size` variant:
 * - `"sm"`: 8px circle, icon hidden.
 * - `"default"`: 10px circle, icon at 8px.
 * - `"lg"`: 12px circle, icon at 8px.
 *
 * Must be placed as a direct child of `Avatar` to function correctly.
 *
 * @param props - Standard HTML `<span>` props. Place an icon as a child if needed.
 * @returns {JSX.Element} A positioned status badge element.
 *
 * @example
 * <Avatar>
 *   <AvatarImage src="/avatar.jpg" />
 *   <AvatarFallback>JD</AvatarFallback>
 *   <AvatarBadge>
 *     <CheckIcon />
 *   </AvatarBadge>
 * </Avatar>
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
}

/**
 * AvatarGroup Component
 *
 * A container that renders multiple `Avatar` components in an overlapping horizontal stack.
 * Applies negative spacing (`-space-x-2`) and a ring around each avatar
 * to visually separate overlapping items.
 *
 * @param props - Standard HTML `<div>` props.
 * @returns {JSX.Element} A flex container for a group of overlapping avatars.
 *
 * @example
 * <AvatarGroup>
 *   <Avatar><AvatarImage src="/user1.jpg" /></Avatar>
 *   <Avatar><AvatarImage src="/user2.jpg" /></Avatar>
 *   <AvatarGroupCount>+3</AvatarGroupCount>
 * </AvatarGroup>
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      data-slot="avatar-group"
      {...props}
    />
  );
}

/**
 * AvatarGroupCount Component
 *
 * A numeric overflow indicator rendered at the end of an `AvatarGroup`
 * to show how many additional avatars are not displayed.
 *
 * Dimensions match the sibling avatars' size automatically via group context selectors.
 *
 * @param props - Standard HTML `<div>` props. Pass the overflow count as children (e.g., `"+5"`).
 * @returns {JSX.Element} A styled count badge matching the avatar group's size.
 *
 * @example
 * <AvatarGroup>
 *   <Avatar><AvatarImage src="/user1.jpg" /></Avatar>
 *   <Avatar><AvatarImage src="/user2.jpg" /></Avatar>
 *   <AvatarGroupCount>+8</AvatarGroupCount>
 * </AvatarGroup>
 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
