/**
 * @file app/layout.tsx
 * @description Root layout component for the NexusLive Next.js application.
 *
 * Serves as the top-level layout that wraps all pages in the application.
 * Establishes the base HTML structure, global styles, font configuration,
 * theme management (light/dark), and authentication provider context.
 *
 * This layout is automatically applied to all routes in the application
 * as per Next.js App Router conventions.
 *
 * @module RootLayout
 * @requires next/font/google
 * @requires @/components/theme-provider
 * @requires @/components/clerk-theme-provider
 */

import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * Inter font configuration using Next.js built-in font optimization.
 *
 * Loads the Inter typeface with:
 * - Latin character subset for optimal bundle size
 * - CSS variable `--font-sans` for use in Tailwind CSS configuration
 *
 * Next.js automatically optimizes font loading by:
 * - Self-hosting the font files
 * - Eliminating external network requests
 * - Preventing layout shift with automatic font-display configuration
 *
 * @type {import('next/font/google').NextFont}
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

/**
 * Application-wide metadata configuration for SEO and browser display.
 *
 * Applied globally across all pages unless overridden by page-level
 * or nested layout metadata exports.
 *
 * @type {import('next').Metadata}
 * @property {string} title - Browser tab title and SEO page title
 * @property {string} description - SEO meta description for search engines
 * @property {Object} icons - Favicon and app icon configuration
 * @property {string} icons.icon - Path to the application favicon (SVG format)
 */
export const metadata: Metadata = {
  title: "NexusLive",
  description: "Where creators and communities connect in real time.",
  icons: {
    icon: "/spooky.svg",
  },
};

/**
 * RootLayout component that wraps the entire application.
 *
 * Establishes the foundational HTML structure for all pages, including:
 * - Global font application via CSS variable
 * - Full-height layout configuration
 * - Anti-aliased text rendering
 * - Theme management via next-themes (light/dark/system)
 * - Clerk authentication provider with theme-aware appearance
 *
 * Provider nesting order (outer → inner):
 * 1. ThemeProvider (next-themes) — manages the `.dark` class on `<html>`
 * 2. ClerkThemeProvider — reads the resolved theme and passes it to Clerk
 *
 * @component
 * @param {LayoutProps<"/">} props - Layout component props
 * @param {React.ReactNode} props.children - Child components/pages to render
 *
 * @returns {JSX.Element} The root HTML document structure
 *
 * @example
 * // Automatically applied by Next.js App Router to all routes:
 * // app/page.tsx        → wrapped by RootLayout
 * // app/dashboard/page.tsx → wrapped by RootLayout
 */
export default function RootLayout({
  children,
}: LayoutProps<"/">): React.JSX.Element {
  return (
    /*
     * Root HTML element.
     *
     * Applied classes:
     * - `h-full`       : Full viewport height for proper layout stretching
     * - `antialiased`  : Smooth font rendering across operating systems
     * - `font-sans`    : Applies the Inter font via the --font-sans CSS variable
     * - `inter.variable` : Injects the --font-sans CSS variable into the document
     *
     * `suppressHydrationWarning` is required by next-themes because it
     * injects the theme class (`dark`) on the `<html>` element before
     * hydration, which would otherwise cause a React hydration mismatch.
     */
    <html
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
      lang="en"
      suppressHydrationWarning
    >
      {/*
       * Body element configured as a full-height flex column.
       *
       * Applied classes:
       * - `flex`        : Enables flexbox for vertical content stacking
       * - `min-h-full`  : Ensures body occupies at least full viewport height
       * - `flex-col`    : Stacks children vertically (header, main, footer pattern)
       */}
      <body className="flex min-h-full flex-col">
        {/*
         * ThemeProvider (next-themes): Manages light/dark mode.
         *
         * Configuration:
         * - `attribute="class"` : Toggles the `.dark` class on `<html>`,
         *   which activates the dark CSS variables in globals.css.
         * - `defaultTheme="system"` : Respects the user's OS preference
         *   on first visit.
         * - `enableSystem` : Listens for OS-level theme changes and
         *   updates automatically.
         * - `disableTransitionOnChange` : Prevents a flash of transition
         *   animations when the theme switches.
         */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          storageKey="nexuslive-theme"
        >
          {/*
           * ClerkThemeProvider: Theme-aware authentication context.
           *
           * Reads the resolved theme from next-themes and passes the
           * corresponding Clerk base theme (dark or default light) via
           * the `appearance` prop so all Clerk UI components (SignIn,
           * SignUp, UserButton, etc.) match the current color scheme.
           */}
          <ClerkThemeProvider>{children}</ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
