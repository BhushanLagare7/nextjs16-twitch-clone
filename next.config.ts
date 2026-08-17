import type { NextConfig } from "next";

/**
 * Next.js application configuration.
 *
 * Configures remote image host patterns for UploadThing asset delivery
 * with strict pathname (`/f/*`) and empty search query constraints.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/*",
        search: "",
      },
      {
        protocol: "https",
        hostname: "ufs.sh",
        pathname: "/f/*",
        search: "",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/f/*",
        search: "",
      },
    ],
  },
};

export default nextConfig;
