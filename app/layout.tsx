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
 * @requires @/components/ui/sonner
 * @requires @/lib/utils
 */

import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

/**
 * Viewport configuration exported separately as per Next.js requirements.
 * Defines responsive scaling behavior and theme-dependent browser chrome colors.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

/**
 * Structured schema definitions for search engine indexing.
 */
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NexusLive",
    url: appUrl,
    description: "Where creators and communities connect in real time.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${appUrl}/search?term={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NexusLive",
    url: appUrl,
    logo: `${appUrl}/spooky.svg`,
  },
];

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
 */
export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "NexusLive - Real-Time Creator Live Streaming Platform",
    template: "%s | NexusLive",
  },
  description:
    "NexusLive is a modern real-time live streaming platform where creators and communities connect, chat, and stream.",
  keywords: [
    "live streaming",
    "game streaming",
    "creators",
    "real-time chat",
    "NexusLive",
    "video broadcasting",
    "streamer community",
  ],
  authors: [{ name: "NexusLive" }],
  creator: "NexusLive",
  publisher: "NexusLive",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NexusLive",
    title: "NexusLive - Real-Time Creator Live Streaming Platform",
    description: "Where creators and communities connect in real time.",
    images: [
      {
        url: "/spooky.svg",
        width: 1200,
        height: 630,
        alt: "NexusLive streaming platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusLive - Real-Time Creator Live Streaming Platform",
    description: "Where creators and communities connect in real time.",
    images: ["/spooky.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
 * - Global toast notification support via Sonner
 *
 * Provider nesting order (outer → inner):
 * 1. ThemeProvider (next-themes) — manages the `.dark` class on `<html>`
 * 2. ClerkThemeProvider — reads the resolved theme and passes it to Clerk
 *
 * @component
 * @param {Object} props - Layout component props
 * @param {React.ReactNode} props.children - Child components/pages to render
 *
 * @returns {React.JSX.Element} The root HTML document structure
 *
 * @example
 * // Automatically applied by Next.js App Router to all routes:
 * // app/page.tsx              → wrapped by RootLayout
 * // app/dashboard/page.tsx    → wrapped by RootLayout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    /*
     * Root HTML element.
     *
     * Applied classes:
     * - `h-full`          : Full viewport height for proper layout stretching
     * - `antialiased`     : Smooth font rendering across operating systems
     * - `font-sans`       : Applies the Inter font via the --font-sans CSS variable
     * - `inter.variable`  : Injects the --font-sans CSS variable into the document
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
        {/* Schema.org structured data */}
        <JsonLd data={structuredData} />
        {/*
         * NextSSRPlugin: UploadThing SSR optimization.
         *
         * Extracts the file router configuration on the server side and
         * injects it into the page, preventing a client-side loading state
         * flash when UploadThing components (UploadButton, UploadDropzone)
         * need to fetch permissions info.
         */}
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {/*
         * ThemeProvider (next-themes): Manages light/dark mode.
         *
         * Configuration:
         * - `attribute="class"`         : Toggles the `.dark` class on `<html>`,
         *   which activates the dark CSS variables in globals.css.
         * - `defaultTheme="system"`     : Respects the user's OS preference
         *   on first visit.
         * - `enableSystem`              : Listens for OS-level theme changes and
         *   updates automatically.
         * - `disableTransitionOnChange` : Prevents a flash of transition
         *   animations when the theme switches.
         * - `storageKey="nexuslive-theme"` : Key used in localStorage to persist
         *   the user's chosen theme across sessions.
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
          <ClerkThemeProvider>
            {/*
             * Toaster: Global toast notification container (Sonner).
             *
             * Renders outside the page content so toast messages appear
             * consistently across all routes without re-mounting.
             * Theme-aware — automatically matches the active light/dark mode.
             */}
            <Toaster />
            {children}
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
