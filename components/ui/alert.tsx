/**
 * @file components/ui/alert.tsx
 * @description Accessible alert UI components for displaying contextual
 * messages such as warnings, errors, or informational notices.
 *
 * Components:
 * - `Alert`            — Root container with variant styling and ARIA role.
 * - `AlertTitle`       — Bold heading text for the alert.
 * - `AlertDescription` — Supplementary descriptive text for the alert.
 * - `AlertAction`      — Absolutely positioned slot for an action element (e.g., a button).
 *
 * Variants:
 * - `default`     — Standard card background with foreground text.
 * - `destructive` — Highlights the alert with destructive/error styling.
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Class variance configuration for the Alert component.
 *
 * Supports `default` and `destructive` variants to communicate
 * different levels of severity or intent.
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** Default styling: card background with standard foreground text. */
        default: "bg-card text-card-foreground",
        /** Destructive styling: highlights errors or critical warnings. */
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Alert - Root alert container component.
 *
 * Renders a `div` with `role="alert"` for accessibility and applies
 * variant-based styling via class variance authority.
 *
 * @param {React.ComponentProps<"div"> & VariantProps<typeof alertVariants>} props
 * @param {string} [props.className] - Additional CSS classes.
 * @param {"default" | "destructive"} [props.variant="default"] - Visual style variant.
 * @returns {JSX.Element} A styled alert container `div`.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

/**
 * AlertTitle - Heading element for the alert.
 *
 * Renders a `div` styled as a medium-weight heading. When the alert
 * contains an SVG icon, the title is automatically positioned in the
 * second grid column.
 *
 * @param {React.ComponentProps<"div">} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} A styled title `div`.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className,
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

/**
 * AlertDescription - Descriptive text content for the alert.
 *
 * Provides additional context or detail below the alert title.
 * Styled with muted foreground color and balanced text layout.
 *
 * @param {React.ComponentProps<"div">} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} A styled description `div`.
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

/**
 * AlertAction - Absolutely positioned action slot within the alert.
 *
 * Used to place an interactive element (e.g., a dismiss button or a link)
 * in the top-right corner of the alert container.
 *
 * @param {React.ComponentProps<"div">} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} A positioned action `div`.
 */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("absolute top-2.5 right-3", className)}
      data-slot="alert-action"
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
