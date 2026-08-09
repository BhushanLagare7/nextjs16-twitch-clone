/**
 * @file logo.tsx
 * @description Logo component that displays the application's brand identity
 * and serves as a home page navigation link.
 */

import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Poppins font configuration for the logo text.
 * Loads multiple weights to support various text styles.
 *
 * @see {@link https://fonts.google.com/specimen/Poppins}
 */
const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

/**
 * Logo component that renders the application's brand mark and name.
 * Acts as a navigational link to the home page.
 *
 * @component
 * @example
 * // Basic usage within the Navbar
 * <Logo />
 *
 * @remarks
 * - Clicking the logo navigates the user to the home page ("/")
 * - On mobile: displays only the logo image
 * - On large screens (lg+): displays both the logo image and brand name
 * - Includes a hover effect that reduces opacity for visual feedback
 * - Uses the Poppins font for the brand text
 * - Supports both light and dark themes via Tailwind CSS classes
 *
 * @returns {JSX.Element} A linked logo with an image and responsive brand name text
 */
export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-4 transition hover:opacity-75">
        {/* Logo image container with responsive margin adjustments */}
        <div className="mr-12 shrink-0 rounded-full bg-foreground/10 p-1 lg:mr-0 lg:shrink">
          <Image alt="NexusLive" height="32" src="/spooky.svg" width="32" />
        </div>
        {/* Brand name and tagline - hidden on mobile, visible on large screens */}
        <div className={cn("hidden lg:block", font.className)}>
          <p className="text-lg font-semibold">NexusLive</p>
          <p className="text-xs text-muted-foreground">Let&apos;s play</p>
        </div>
      </div>
    </Link>
  );
}
