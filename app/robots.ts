/**
 * @file app/robots.ts
 * @description Next.js App Router robots.txt configuration.
 * Configures search engine crawling rules and points crawlers to the dynamic sitemap.
 *
 * @module app/robots
 */

import type { MetadataRoute } from "next";

/**
 * Generates the robots.txt rules for the application.
 *
 * Directs search engine bots to allow indexing of public content (channels, home, categories)
 * while blocking access to authenticated creator dashboards and backend API routes to conserve
 * crawl budget and maintain privacy.
 *
 * @returns {MetadataRoute.Robots} The robots configuration object.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/u/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
