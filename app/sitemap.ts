/**
 * @file app/sitemap.ts
 * @description Dynamic XML Sitemap generator for the NexusLive application.
 * Queries all creators and live streams from the database to enable search engine discovery.
 *
 * @module app/sitemap
 */

import type { MetadataRoute } from "next";

import { db } from "@/lib/db";

/**
 * Revalidate sitemap every hour (3600 seconds) to balance freshness with database load.
 */
export const revalidate = 3600;

/**
 * Dynamically builds the sitemap containing static pages and all creator stream channels.
 *
 * Live channels are assigned higher priority and more frequent update cycles
 * to ensure search engine indexes reflect active broadcasts.
 *
 * @returns {Promise<MetadataRoute.Sitemap>} Array of sitemap entries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  let creatorEntries: MetadataRoute.Sitemap = [];

  try {
    const users = await db.user.findMany({
      select: {
        username: true,
        updatedAt: true,
        stream: {
          select: {
            updatedAt: true,
            isLive: true,
            thumbnailUrl: true,
          },
        },
      },
      take: 5000,
    });

    creatorEntries = users.map((user) => ({
      url: `${baseUrl}/${user.username}`,
      lastModified: user.stream?.updatedAt || user.updatedAt,
      changeFrequency: user.stream?.isLive ? "hourly" : "weekly",
      priority: user.stream?.isLive ? 0.9 : 0.7,
      ...(user.stream?.thumbnailUrl && {
        images: [user.stream.thumbnailUrl],
      }),
    }));
  } catch (error) {
    console.error("Failed to generate creator sitemap entries:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...creatorEntries,
  ];
}
