/**
 * @file components/theme-toggle.tsx
 * @description A dropdown-based theme toggle component that allows users
 * to switch between Light, Dark, and System color schemes.
 *
 * Uses `next-themes` for theme management and renders a dropdown menu
 * with three options, each indicated by a corresponding icon.
 *
 * @module ThemeToggle
 * @requires next-themes
 * @requires lucide-react
 * @requires @/components/ui/button
 * @requires @/components/ui/dropdown-menu
 */

"use client";

import { useTheme } from "next-themes";

import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ThemeToggle component that renders a dropdown menu for switching themes.
 *
 * Displays a sun/moon icon button that opens a dropdown with three options:
 * - **Light** — Forces the light color scheme
 * - **Dark** — Forces the dark color scheme
 * - **System** — Follows the user's OS preference
 *
 * The button icon animates between a sun (light mode) and moon (dark mode)
 * using CSS scale/rotate transforms for a smooth transition.
 *
 * @component
 * @returns {JSX.Element} A dropdown menu trigger with theme options
 *
 * @example
 * ```tsx
 * // In a navbar or header component:
 * <nav className="flex items-center gap-2">
 *   <ThemeToggle />
 *   <UserButton />
 * </nav>
 * ```
 */
export function ThemeToggle(): React.JSX.Element {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Toggle theme" size="icon" variant="outline">
          {/*
           * Sun icon — visible in light mode, hidden in dark mode.
           * Animates from scale-100 rotate-0 → scale-0 rotate-90 on theme change.
           */}
          <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          {/*
           * Moon icon — hidden in light mode, visible in dark mode.
           * Uses absolute positioning to overlay the sun icon.
           * Animates from rotate-90 scale-0 → rotate-0 scale-100 on theme change.
           */}
          <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon className="mr-2 size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon className="mr-2 size-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <LaptopIcon className="mr-2 size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
