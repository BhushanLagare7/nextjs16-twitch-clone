/**
 * @file page.tsx
 * @description User profile/stream page that renders a live stream player for a given username.
 *
 * Fetches the user's data, stream, follow status, and block status before rendering.
 * Redirects to a 404 page if the user, their stream, or a block relationship is not found.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { BroadcastEvent, WithContext } from "schema-dts";

import { JsonLd } from "@/components/seo/json-ld";
import { StreamPlayer } from "@/components/stream-player";
import { isBlockedByUser } from "@/lib/block-service";
import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";

/**
 * Props for the UserPage component and dynamic metadata generator.
 *
 * @interface UserPageProps
 * @property {Promise<{ username: string }>} params - Route parameters containing the username.
 */
interface UserPageProps {
  params: Promise<{ username: string }>;
}

/**
 * Generates dynamic SEO metadata for the user's channel and stream page.
 *
 * Dynamically computes:
 * - Dynamic page title including stream title and creator name
 * - Meta description based on user bio or live broadcast context
 * - OpenGraph & Twitter Card images (stream thumbnail or creator avatar)
 * - Canonical link URL
 *
 * @param {UserPageProps} props - Component props containing the route params Promise.
 * @returns {Promise<Metadata>} The computed Next.js metadata object.
 */
export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user || !user.stream) {
    return {
      title: "Stream Not Found",
      description: "The requested stream or creator profile could not be found.",
    };
  }

  const title = user.stream.name
    ? `${user.stream.name} - ${user.username}`
    : `${user.username}'s Stream`;
  const description =
    user.bio ||
    `Watch ${user.username} live streaming on NexusLive. Join the real-time chat and community.`;
  const image = user.stream.thumbnailUrl || user.imageUrl;

  return {
    title,
    description,
    alternates: {
      canonical: `/${user.username}`,
    },
    openGraph: {
      title: `${title} | NexusLive`,
      description,
      url: `/${user.username}`,
      type: "video.other",
      images: image
        ? [
            {
              url: image,
              alt: `${user.username}'s stream thumbnail`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | NexusLive`,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * UserPage component.
 *
 * An async server component that:
 * - Resolves the `username` from the route parameters.
 * - Fetches the user's data and associated stream from the database.
 * - Redirects to a 404 page if the user or stream does not exist.
 * - Checks if the current viewer has been blocked by the user and redirects to 404 if so.
 * - Checks if the current viewer is following the user.
 * - Renders JSON-LD structured data and the `StreamPlayer` component.
 *
 * @param {UserPageProps} props - Component props containing the route parameters.
 * @returns {Promise<JSX.Element>} The rendered stream player for the specified user.
 */
export default async function UserPage({ params }: UserPageProps) {
  // Resolve the username from the dynamic route parameters.
  const { username } = await params;

  // Fetch the user and their associated stream from the database.
  const user = await getUserByUsername(username);

  // Redirect to the 404 page if the user or their stream does not exist.
  if (!user || !user.stream) {
    notFound();
  }

  // Check follow and block status concurrently since they are independent.
  const [isFollowing, isBlocked] = await Promise.all([
    isFollowingUser(user.id),
    isBlockedByUser(user.id),
  ]);

  // Redirect to the 404 page if the current viewer is blocked by this user.
  if (isBlocked) {
    notFound();
  }

  const streamSchema: WithContext<BroadcastEvent> = {
    "@context": "https://schema.org",
    "@type": "BroadcastEvent",
    name: user.stream.name || `${user.username}'s Live Stream`,
    description:
      user.bio || `Live broadcast by ${user.username} on NexusLive.`,
    isLiveBroadcast: user.stream.isLive,
    videoFormat: "HD",
    actor: {
      "@type": "Person",
      name: user.username,
      image: user.imageUrl,
    },
  };

  return (
    <>
      <JsonLd data={streamSchema} />
      <StreamPlayer
        isFollowing={isFollowing}
        stream={user.stream}
        user={user}
      />
    </>
  );
}
