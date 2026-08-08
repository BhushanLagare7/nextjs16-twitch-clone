/**
 * @file components/clerk-theme-provider.tsx
 * @description Client component that wraps ClerkProvider and dynamically
 * applies the correct Clerk theme (light or dark) based on the current
 * application theme from next-themes.
 *
 * This component solves the problem of Clerk components always rendering
 * in light mode by reading the resolved theme from next-themes and
 * passing the appropriate theme via Clerk's `appearance` prop.
 *
 * In Clerk v7 (`@clerk/nextjs` v7), the appearance API uses the `theme`
 * property (not `baseTheme`) as part of the new `@clerk/ui` type system.
 *
 * @module ClerkThemeProvider
 * @requires @clerk/nextjs
 * @requires @clerk/themes
 * @requires next-themes
 */

"use client";

import { useTheme } from "next-themes";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

/**
 * ClerkThemeProvider component that syncs Clerk's theme with the app theme.
 *
 * Reads the current resolved theme (light/dark) from next-themes and
 * applies the corresponding Clerk base theme:
 * - Dark mode → uses `@clerk/themes` dark theme
 * - Light mode → uses Clerk's default (light) theme
 *
 * This ensures all Clerk screens (SignIn, SignUp, UserButton, UserProfile,
 * etc.) correctly match the application's current color scheme.
 *
 * @component
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render
 *
 * @returns {JSX.Element} ClerkProvider with theme-aware appearance
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   <ClerkThemeProvider>
 *     {children}
 *   </ClerkThemeProvider>
 * </ThemeProvider>
 * ```
 */
export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={
        {
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        } as Record<string, unknown>
      }
    >
      {children}
    </ClerkProvider>
  );
}
