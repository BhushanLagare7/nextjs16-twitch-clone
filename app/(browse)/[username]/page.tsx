/**
 * @file page.tsx
 * @description User profile/stream page that renders a live stream player for a given username.
 *
 * Fetches the user's data, stream, follow status, and block status before rendering.
 * Redirects to a 404 page if the user, their stream, or a block relationship is not found.
 */

import { notFound } from "next/navigation";

import { StreamPlayer } from "@/components/stream-player";
import { isBlockedByUser } from "@/lib/block-service";
import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";

/**
 * Props for the UserPage component.
 *
 * @interface UserPageProps
 * @property {Promise<{ username: string }>} params - Route parameters containing the username.
 */
interface UserPageProps {
  params: Promise<{ username: string }>;
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
 * - Renders the `StreamPlayer` component with the fetched data.
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

  return (
    // Render the StreamPlayer with the user's stream data and relationship statuses.
    <StreamPlayer isFollowing={isFollowing} stream={user.stream} user={user} />
  );
}
