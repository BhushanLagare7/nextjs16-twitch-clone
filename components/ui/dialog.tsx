/**
 * @file components/ui/dialog.tsx
 * @description Accessible modal dialog components built on top of Radix UI's
 * Dialog primitive with custom styling and an optional close button.
 *
 * Components:
 * - `Dialog`            — Root dialog state manager.
 * - `DialogTrigger`     — Element that opens the dialog.
 * - `DialogPortal`      — Renders dialog content outside the DOM hierarchy.
 * - `DialogClose`       — Element that closes the dialog.
 * - `DialogOverlay`     — Semi-transparent backdrop behind the dialog content.
 * - `DialogContent`     — Main content container with optional close button.
 * - `DialogHeader`      — Container for the dialog title and description.
 * - `DialogFooter`      — Container for dialog action buttons with optional close button.
 * - `DialogTitle`       — Accessible title for the dialog.
 * - `DialogDescription` — Accessible supplementary description for the dialog.
 */

"use client";

import * as React from "react";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Dialog - Root component managing the open/close state of the dialog.
 *
 * Wraps Radix UI's `Dialog.Root` with a `data-slot` attribute for styling hooks.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Root>} props
 * @returns {JSX.Element} The dialog root component.
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * DialogTrigger - Element that opens the dialog when interacted with.
 *
 * Wraps Radix UI's `Dialog.Trigger` with a `data-slot` attribute.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Trigger>} props
 * @returns {JSX.Element} The dialog trigger element.
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * DialogPortal - Renders dialog content into a portal outside the current DOM tree.
 *
 * Wraps Radix UI's `Dialog.Portal` with a `data-slot` attribute.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Portal>} props
 * @returns {JSX.Element} The dialog portal.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * DialogClose - Element that closes the dialog when interacted with.
 *
 * Wraps Radix UI's `Dialog.Close` with a `data-slot` attribute.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Close>} props
 * @returns {JSX.Element} The dialog close element.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * DialogOverlay - Semi-transparent backdrop rendered behind the dialog content.
 *
 * Includes fade-in/fade-out animations tied to the dialog open/close state.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Overlay>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The dialog overlay element.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

/**
 * DialogContent - Main content container for the dialog.
 *
 * Rendered inside a `DialogPortal` on top of a `DialogOverlay`.
 * Includes enter/exit animations and an optional close button (shown by default).
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }} props
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Content to render inside the dialog.
 * @param {boolean} [props.showCloseButton=true] - Whether to display the close (X) button.
 * @returns {JSX.Element} The dialog content container.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      {/* Backdrop overlay */}
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {/* Optional close button positioned in the top-right corner */}
        {showCloseButton && (
          <DialogPrimitive.Close asChild data-slot="dialog-close">
            <Button
              className="absolute top-4 right-4"
              size="icon-sm"
              variant="ghost"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * DialogHeader - Layout container for the dialog's title and description.
 *
 * Renders a vertically stacked flex container with consistent spacing.
 *
 * @param {React.ComponentProps<"div">} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} A styled header `div`.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-slot="dialog-header"
      {...props}
    />
  );
}

/**
 * DialogFooter - Layout container for dialog action buttons.
 *
 * Renders buttons in a column-reverse layout on mobile and a right-aligned
 * row on larger screens. Optionally renders a "Close" button.
 *
 * @param {React.ComponentProps<"div"> & { showCloseButton?: boolean }} props
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Action buttons or other content.
 * @param {boolean} [props.showCloseButton=false] - Whether to render a built-in "Close" button.
 * @returns {JSX.Element} A styled footer `div`.
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {/* Optional built-in close button rendered at the end of the footer */}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/**
 * DialogTitle - Accessible title for the dialog.
 *
 * Wraps Radix UI's `Dialog.Title` with consistent heading typography.
 * Required for accessibility — announces the dialog's purpose to screen readers.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Title>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The dialog title element.
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-heading leading-none font-medium", className)}
      data-slot="dialog-title"
      {...props}
    />
  );
}

/**
 * DialogDescription - Accessible supplementary description for the dialog.
 *
 * Wraps Radix UI's `Dialog.Description` with muted foreground styling.
 * Provides additional context to assistive technologies.
 *
 * @param {React.ComponentProps<typeof DialogPrimitive.Description>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The dialog description element.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
