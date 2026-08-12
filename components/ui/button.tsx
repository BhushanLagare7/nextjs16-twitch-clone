/**
 * @file button.tsx
 * @description A polymorphic, accessible Button component built with
 * Radix UI's `Slot` primitive and `class-variance-authority` (CVA).
 *
 * Supports multiple visual variants and sizes, inline icon slots,
 * button-group composition, and full ARIA state styling
 * (`aria-invalid`, `aria-expanded`, `aria-haspopup`).
 *
 * @module components/ui/button
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/utilities/slot | Radix UI Slot}
 * @see {@link https://cva.style/docs | class-variance-authority}
 */

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// ─── Variants ─────────────────────────────────────────────────────────────────

/**
 * CVA factory that generates the full `className` string for a `Button`.
 *
 * ---
 * ### Base classes (always applied)
 *
 * | Class | Purpose |
 * |---|---|
 * | `group/button` | Named group for Tailwind group-hover utilities scoped to buttons |
 * | `inline-flex shrink-0 items-center justify-center` | Flex layout; prevents unintended shrinkage in flex containers |
 * | `rounded-md border border-transparent` | Default shape; transparent border reserves space so focus rings don't cause layout shifts |
 * | `bg-clip-padding` | Prevents background from bleeding under the border |
 * | `text-sm font-medium whitespace-nowrap` | Typography defaults |
 * | `transition-all` | Smooth transitions for hover/focus state changes |
 * | `outline-none select-none` | Removes UA outline (replaced by custom focus ring); prevents text selection on click |
 * | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` | Keyboard-only focus ring using the design-token `--ring` |
 * | `active:not-aria-[haspopup]:translate-y-px` | Subtle press animation; suppressed on trigger buttons (`aria-haspopup`) |
 * | `disabled:pointer-events-none disabled:opacity-50` | Disabled state — blocks interaction and dims the button |
 * | `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` | Validation error state (light mode) |
 * | `dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40` | Validation error state (dark mode) |
 * | `[&_svg]:pointer-events-none [&_svg]:shrink-0` | Prevents SVG icons from intercepting pointer events or shrinking |
 * | `[&_svg:not([class*='size-'])]:size-4` | Applies a default 1rem size to icons that don't already have a size class |
 *
 * ---
 * ### `variant` — Visual style
 *
 * | Value | Description |
 * |---|---|
 * | `default` | Solid primary-color fill; primary foreground text |
 * | `outline` | Bordered, transparent background; muted on hover/expand |
 * | `secondary` | Secondary-color fill; color-mixed hover to subtly darken |
 * | `ghost` | No background; muted hover — ideal for toolbars |
 * | `destructive` | Soft red tint; reinforces danger without full red fill |
 * | `link` | Looks like an anchor tag; underline on hover |
 *
 * ---
 * ### `size` — Dimensions and spacing
 *
 * | Value | Height | Notes |
 * |---|---|---|
 * | `default` | `h-9` (36 px) | Standard; adjusts padding for inline-icon slots |
 * | `xs` | `h-6` (24 px) | Extra-small; smaller icon size (`size-3`) |
 * | `sm` | `h-8` (32 px) | Small; tighter radius cap |
 * | `lg` | `h-10` (40 px) | Large |
 * | `icon` | `size-9` (36 px square) | Square icon-only button |
 * | `icon-xs` | `size-6` (24 px square) | Square icon-only, extra-small |
 * | `icon-sm` | `size-8` (32 px square) | Square icon-only, small |
 * | `icon-lg` | `size-10` (40 px square) | Square icon-only, large |
 *
 * The `in-data-[slot=button-group]` modifier normalises border-radius when
 * the button is rendered inside a `ButtonGroup` component.
 *
 * The `has-data-[icon=inline-start|inline-end]` modifier reduces horizontal
 * padding on the icon side when an inline icon slot is present, maintaining
 * optical balance.
 *
 * @see {@link https://cva.style/docs/getting-started/variants | CVA variants}
 */
const buttonVariants = cva(
  // Base classes — applied to every button regardless of variant or size
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      /**
       * Controls the visual appearance of the button.
       *
       * - `default`     — Solid primary background; use for primary CTAs.
       * - `outline`     — Bordered with transparent background; secondary actions.
       * - `secondary`   — Softer filled style; alternative to `default`.
       * - `ghost`       — No visible background until hovered; toolbar/icon actions.
       * - `destructive` — Soft red tint; destructive or irreversible actions.
       * - `link`        — Unstyled anchor appearance; inline text actions.
       */
      variant: {
        /** Solid primary-color fill. Use for the main call-to-action. */
        default: "bg-primary text-primary-foreground hover:bg-primary/80",

        /**
         * Bordered button with transparent background.
         * Switches to a muted background on hover and when `aria-expanded` is true.
         * Dark mode uses the `--input` token for the background.
         */
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        /**
         * Secondary filled style.
         * Uses `color-mix` in OKLCH to compute a slightly darker hover shade
         * relative to the `--secondary` token, avoiding a hard-coded colour.
         */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",

        /**
         * No visible background at rest.
         * Ideal for toolbar buttons or icon actions where a border/fill would
         * add visual noise. Dark mode uses a semi-transparent muted hover.
         */
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",

        /**
         * Soft red tint communicating a dangerous or irreversible action.
         * Intentionally uses a low-opacity fill rather than a solid red to
         * avoid alarming users — reserve solid red for confirmation dialogs.
         */
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",

        /**
         * Renders the button as a styled hyperlink.
         * No background or border — only an underline on hover.
         * Suitable for inline text-level actions.
         */
        link: "text-primary underline-offset-4 hover:underline",
        /**
         * Primary button variant — blue background with hover effect.
         * Hover opacity is reduced to 80% on hover for a subtle effect.
         */
        primary: "text-white bg-blue-600 hover:bg-blue-700",
      },

      /**
       * Controls the dimensions and internal spacing of the button.
       *
       * Text buttons (`default` | `xs` | `sm` | `lg`) use `h-*` + `px-*`.
       * Icon-only buttons (`icon` | `icon-xs` | `icon-sm` | `icon-lg`)
       * use `size-*` (equal width and height) and omit horizontal padding.
       *
       * All sizes except `lg` and `icon-lg` include:
       * - `in-data-[slot=button-group]:rounded-md` — flattens border-radius
       *   when nested inside a `ButtonGroup`.
       * - `has-data-[icon=inline-start]:pl-*` / `has-data-[icon=inline-end]:pr-*`
       *   — reduces padding on the icon side for optical balance.
       */
      size: {
        /**
         * Default size — `h-9` (36 px).
         * Standard button height suitable for most UI contexts.
         */
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",

        /**
         * Extra-small — `h-6` (24 px).
         * Used for compact UIs (e.g. table actions, badge buttons).
         * Icons are capped at `size-3` (12 px).
         * Border-radius is capped at `8px` via `min()` to stay proportional.
         */
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",

        /**
         * Small — `h-8` (32 px).
         * Slightly more compact than the default.
         * Border-radius is capped at `10px` via `min()`.
         */
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",

        /**
         * Large — `h-10` (40 px).
         * Use for prominent CTAs or touch-friendly surfaces.
         * Does not override border-radius (inherits `rounded-md` from base).
         */
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",

        /**
         * Icon-only default — `size-9` (36 × 36 px).
         * Square button with no text; uses `size-*` instead of `h-*`/`px-*`.
         */
        icon: "size-9",

        /**
         * Icon-only extra-small — `size-6` (24 × 24 px).
         * Icons are capped at `size-3` (12 px).
         */
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",

        /**
         * Icon-only small — `size-8` (32 × 32 px).
         * Border-radius is capped at `10px` via `min()`.
         */
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",

        /**
         * Icon-only large — `size-10` (40 × 40 px).
         * Use for prominent icon actions on touch surfaces.
         */
        "icon-lg": "size-10",
      },
    },

    /**
     * Fallback variant values applied when no explicit prop is provided.
     * Keeps the component functional as a zero-config drop-in.
     */
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Props for the `Button` component.
 *
 * Extends the native `<button>` element's props with CVA variant props
 * and an `asChild` escape hatch.
 *
 * @property {string}  [className]  - Additional Tailwind classes merged via `cn`.
 * @property {string}  [variant]    - Visual style variant. Defaults to `"default"`.
 * @property {string}  [size]       - Size variant. Defaults to `"default"`.
 * @property {boolean} [asChild]    - When `true`, merges button behaviour onto
 *                                    its immediate child element via Radix UI's
 *                                    `Slot.Root`. Useful for rendering the button
 *                                    as a `<Link>`, `<a>`, or any other element
 *                                    while retaining all button styling and props.
 *                                    Defaults to `false`.
 */
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

/**
 * A polymorphic, accessible button component.
 *
 * ---
 * ### Basic usage
 * ```tsx
 * <Button>Click me</Button>
 * ```
 *
 * ### Variants
 * ```tsx
 * <Button variant="outline">Outline</Button>
 * <Button variant="destructive">Delete</Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="link">Link</Button>
 * <Button variant="secondary">Secondary</Button>
 * ```
 *
 * ### Sizes
 * ```tsx
 * <Button size="xs">Extra small</Button>
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 *
 * // Icon-only
 * <Button size="icon" aria-label="Settings">
 *   <SettingsIcon />
 * </Button>
 * ```
 *
 * ### As child (polymorphic)
 * Delegates all rendering to the child element while forwarding
 * button props and styles. Ideal for Next.js `<Link>` integration.
 * ```tsx
 * <Button asChild>
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 * ```
 *
 * ### Disabled state
 * ```tsx
 * <Button disabled>Unavailable</Button>
 * ```
 *
 * ### Validation / error state
 * ```tsx
 * // `aria-invalid` triggers the destructive ring styling automatically.
 * <Button aria-invalid="true">Invalid Action</Button>
 * ```
 *
 * ---
 * ### Data attributes (set automatically)
 *
 * | Attribute | Value | Purpose |
 * |---|---|---|
 * | `data-slot` | `"button"` | Identifies the element in ButtonGroup / parent components |
 * | `data-variant` | active variant | Allows parent CSS selectors to style based on variant |
 * | `data-size` | active size | Allows parent CSS selectors to style based on size |
 *
 * @param {ButtonProps} props - Button props (see {@link ButtonProps}).
 * @returns {React.JSX.Element} A `<button>` element, or the child element
 *   decorated with button props when `asChild` is `true`.
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/utilities/slot | Radix UI Slot}
 * @see {@link buttonVariants} for the full list of supported variants and sizes.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps): React.JSX.Element {
  /**
   * When `asChild` is `true`, `Slot.Root` clones its single child element and
   * forwards all props (including `className`, event handlers, and data attrs)
   * onto it. This enables full polymorphism without a `React.forwardRef` wrapper.
   *
   * When `asChild` is `false` (the default), a standard `<button>` is rendered.
   */
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      /**
       * Merges the CVA-generated variant classes with any consumer-supplied
       * `className` via `cn` (clsx + tailwind-merge). Consumer classes always
       * win in specificity conflicts thanks to `tailwind-merge`.
       */
      className={cn(buttonVariants({ variant, size, className }))}
      /**
       * Exposes the active size to parent components and CSS selectors.
       * Used by `ButtonGroup` to apply consistent sizing across grouped buttons.
       */
      data-size={size}
      /**
       * Identifies this element as a button slot.
       * Consumed by `ButtonGroup` via `in-data-[slot=button-group]` Tailwind modifier
       * to override border-radius for grouped button layouts.
       */
      data-slot="button"
      /**
       * Exposes the active variant to parent components and CSS selectors.
       * Useful for conditionally styling sibling/parent elements based on
       * which button variant is in use.
       */
      data-variant={variant}
      {...props}
    />
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

/**
 * Named exports:
 *
 * - `Button`         — The React component (default usage).
 * - `buttonVariants` — The CVA factory, exported for consumers who need to
 *                      apply button styles to non-button elements without
 *                      rendering the component (e.g. styled `<Link>` wrappers).
 *
 * @example
 * // Applying button styles to a custom element
 * import { buttonVariants } from "@/components/ui/button";
 *
 * <Link className={buttonVariants({ variant: "outline", size: "sm" })}>
 *   Go back
 * </Link>
 */
export { Button, buttonVariants };
