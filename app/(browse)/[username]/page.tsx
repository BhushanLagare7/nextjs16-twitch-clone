/**
 * @file app/[username]/page.tsx
 * @description Dynamic page component for individual user profile routes.
 *
 * Renders a public-facing user profile page accessible via `/<username>`.
 * Fetches user data by username from the database and determines whether
 * the currently authenticated user is following the viewed profile.
 *
 * Redirects to the Next.js 404 page if the given username does not
 * correspond to an existing user.
 *
 * @module UserPage
 */

import { notFound } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";

import { Actions } from "./_components/actions";

/**
 * Props for the UserPage component.
 *
 * `params` is a Promise in Next.js App Router dynamic routes,
 * requiring `await` before accessing individual route segments.
 *
 * @interface UserPageProps
 * @property {Promise<{ username: string }>} params - Dynamic route parameters.
 * @property {string} params.username - The username segment from the URL path.
 */
interface UserPageProps {
  params: Promise<{ username: string }>;
}

/**
 * UserPage component — async server component for the `/<username>` route.
 *
 * Responsibilities:
 * 1. Resolves the `username` from the dynamic route params.
 * 2. Fetches the matching user record from the database.
 * 3. Returns a 404 response if no user is found.
 * 4. Resolves the authenticated viewer (if any) to determine whether
 *    follow controls should be displayed.
 * 5. Only checks follow status and renders follow/unfollow controls when
 *    the viewer is authenticated and is not viewing their own profile.
 *
 * @async
 * @component
 * @param {UserPageProps} props - The component props.
 * @param {Promise<{ username: string }>} props.params - Dynamic route parameters.
 *
 * @returns {Promise<JSX.Element>} The rendered user profile page.
 *
 * @example
 * // Navigating to /johndoe renders this page with username = "johndoe"
 */
export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  // Fetch the user record matching the URL segment.
  const user = await getUserByUsername(username);

  // Render the 404 page if no matching user exists.
  if (!user) {
    notFound();
  }

  // Resolve the authenticated viewer (null when not signed in).
  const viewer = await currentUser();

  // Only check follow status and show controls for authenticated viewers
  // who are not viewing their own profile.
  const isOwnProfile = viewer?.id === user.externalUserId;
  const showFollowControls = viewer && !isOwnProfile;

  const isFollowing = showFollowControls
    ? await isFollowingUser(user.id)
    : false;

  return (
    <div className="flex flex-col gap-y-4">
      <p>username: {user.username}</p>
      <p>user ID: {user.id}</p>
      <p>is following: {`${isFollowing}`}</p>
      {/* Follow/Unfollow button — only for authenticated viewers on other profiles */}
      {showFollowControls && (
        <Actions isFollowing={isFollowing} userId={user.id} />
      )}
    </div>
  );
}
