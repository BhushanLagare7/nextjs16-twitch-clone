/**
 * @file app/layout.tsx
 * @description Root layout component for the NexusLive Next.js application.
 *
 * Serves as the top-level layout that wraps all pages in the application.
 * Establishes the base HTML structure, global styles, font configuration,
 * and authentication provider context.
 *
 * This layout is automatically applied to all routes in the application
 * as per Next.js App Router conventions.
 *
 * @module RootLayout
 * @requires next/font/google
 * @requires @clerk/nextjs
 */

import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

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
 * - Clerk authentication provider context
 *
 * The ClerkProvider wraps all children to make authentication state,
 * user data, and Clerk hooks available throughout the component tree.
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
     */
    <html
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
      lang="en"
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
         * ClerkProvider: Authentication context provider.
         *
         * Wraps all application content to provide:
         * - Authentication state management
         * - User session handling
         * - Access to Clerk hooks (useUser, useAuth, etc.)
         * - Automatic token refresh
         *
         * @prop {string} afterSignOutUrl - Redirect destination after user signs out.
         *                                  Set to "/" to redirect to the home page.
         */}
        <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>
      </body>
    </html>
  );
}
