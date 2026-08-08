/**
 * @file Logo component for NexusLive application.
 * Renders the application logo with an image and branding text,
 * using the Poppins font from Google Fonts.
 */

import { Poppins } from "next/font/google";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Poppins font configuration with multiple weights for flexible typography.
 * Subsets are limited to Latin characters for optimized loading.
 */
const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

/**
 * Logo component that displays the NexusLive brand identity.
 *
 * Renders a circular image container with the application logo,
 * followed by the application name and tagline using the Poppins font.
 *
 * @returns {React.JSX.Element} A vertically stacked logo with image and brand text.
 *
 * @example
 * // Basic usage
 * <Logo />
 */
export function Logo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-y-4">
      {/* Circular container for the logo image with a subtle background */}
      <div className="rounded-full bg-foreground/10 p-1">
        <Image alt="NexusLive" height="80" src="/spooky.svg" width="80" />
      </div>

      {/* Brand text section with application name and tagline */}
      <div className={cn("flex flex-col items-center", font.className)}>
        <p className="text-xl font-semibold">NexusLive</p>
        <p className="text-sm text-muted-foreground">Let&apos;s play</p>
      </div>
    </div>
  );
}
