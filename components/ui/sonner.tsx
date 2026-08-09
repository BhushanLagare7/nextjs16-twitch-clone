/**
 * @file components/ui/sonner.tsx
 * @description Theme-aware Toaster component wrapping the Sonner notification library.
 *
 * Provides a globally styled toast notification container that automatically
 * synchronises with the application's active light/dark theme via `next-themes`.
 * Custom icons from `lucide-react` replace Sonner's defaults for each toast type,
 * and CSS variables from the design system are applied for consistent visual styling.
 *
 * Intended to be rendered once at the root layout level so toast notifications
 * are accessible from anywhere in the application.
 *
 * @module Toaster
 * @requires next-themes
 * @requires sonner
 * @requires lucide-react
 */

"use client";

import { useTheme } from "next-themes";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster component — theme-aware wrapper around Sonner's `<Toaster />`.
 *
 * Reads the resolved theme (`"light"`, `"dark"`, or `"system"`) from
 * `next-themes` and forwards it to Sonner so toast notifications match
 * the application's current color scheme.
 *
 * Customisations applied on top of Sonner's defaults:
 * - **Icons**: Each toast variant (success, info, warning, error, loading)
 *   uses a corresponding `lucide-react` icon sized at 16 × 16 px.
 * - **Styles**: CSS custom properties map Sonner's internal variables to
 *   the application's design-system tokens (popover background, border, radius).
 * - **Toast class**: A `cn-toast` class name is added to every toast element
 *   to allow global style overrides from `globals.css`.
 *
 * All additional props are forwarded directly to the underlying Sonner
 * `<Toaster />` component, allowing per-use-site customisation.
 *
 * @component
 * @param {ToasterProps} props - Props forwarded to the Sonner `<Toaster />`.
 *   See [Sonner docs](https://sonner.emilkowal.ski/) for the full prop API.
 *
 * @returns {JSX.Element} The configured Sonner Toaster instance.
 *
 * @example
 * // Rendered once in the root layout:
 * <Toaster />
 *
 * // Triggering a toast from anywhere in the app:
 * import { toast } from "sonner";
 * toast.success("Profile updated!");
 */
const Toaster = ({ ...props }: ToasterProps) => {
  /**
   * Retrieve the currently resolved theme from next-themes.
   * Falls back to `"system"` if the theme has not yet been determined
   * (e.g., during SSR before hydration completes).
   */
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      /*
       * Custom icon overrides for each toast variant.
       * All icons are sized with `size-4` (16 × 16 px via Tailwind).
       * The loading icon includes the `animate-spin` utility for a
       * continuous rotation effect while an async operation is pending.
       */
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      /*
       * CSS custom property overrides that map Sonner's internal theming
       * variables to the application's design-system tokens:
       *
       * --normal-bg      → --popover      : Toast background colour
       * --normal-text    → --popover-foreground : Toast text colour
       * --normal-border  → --border       : Toast border colour
       * --border-radius  → --radius       : Consistent border radius
       */
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      // Forward the resolved next-themes value to Sonner's theme prop.
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          /*
           * Applies a shared `cn-toast` class to every toast element,
           * enabling targeted global style overrides in globals.css
           * without relying on Sonner's internal class names.
           */
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
