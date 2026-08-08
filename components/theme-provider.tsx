/**
 * @file components/theme-provider.tsx
 * @description Theme provider component that wraps the application with
 * next-themes support for light/dark mode switching.
 *
 * This is a thin client-side wrapper around `next-themes`' ThemeProvider,
 * necessary because providers that use React Context must be rendered
 * as Client Components in the Next.js App Router.
 *
 * @module ThemeProvider
 * @requires next-themes
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider component that enables light/dark mode support.
 *
 * Wraps the application with `next-themes` to provide:
 * - System preference detection
 * - Manual theme toggling
 * - Theme persistence via cookies/localStorage
 * - Automatic class injection on the `<html>` element
 *
 * @component
 * @param {React.ComponentProps<typeof NextThemesProvider>} props - All props
 *   are forwarded directly to the underlying `next-themes` ThemeProvider.
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>): React.JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
