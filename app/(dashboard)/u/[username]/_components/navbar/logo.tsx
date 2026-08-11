/**
 * @file logo.tsx
 * @description Logo component for the NexusLive application.
 * Renders the brand logo with an image and text, linking to the home page.
 */
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Poppins font configuration for the logo text.
 * Loads multiple font weights to support various text styles.
 */
const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

/**
 * Logo component that displays the NexusLive brand identity.
 * Features a clickable logo that navigates to the home page.
 * On smaller screens, only the logo image is shown.
 * On larger screens (lg breakpoint), the brand name and tagline are also displayed.
 *
 * @returns {JSX.Element} A linked logo component with image and brand text.
 *
 * @example
 * // Usage in Navbar
 * <Logo />
 */
export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-4 transition hover:opacity-75">
        {/* Logo image container with responsive margin adjustments */}
        <div className="mr-12 shrink-0 rounded-full bg-foreground/10 p-1 lg:mr-0 lg:shrink">
          <Image alt="NexusLive" height="32" src="/spooky.svg" width="32" />
        </div>
        {/* Brand name and description - only visible on large screens */}
        <div className={cn("hidden lg:block", font.className)}>
          <p className="text-lg font-semibold">NexusLive</p>
          <p className="text-xs text-muted-foreground">Creator dashboard</p>
        </div>
      </div>
    </Link>
  );
}
