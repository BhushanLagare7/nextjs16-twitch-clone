/**
 * @file app/(dashboard)/u/[username]/page.tsx
 * @description Protected creator dashboard page for managing a personal stream.
 *
 * This page is only accessible to the authenticated user who owns the
 * channel identified by `username`. Any attempt to access this page as
 * another user — or without a matching stream — results in an error.
 *
 * @module CreatorPage
 */

import { currentUser } from "@clerk/nextjs/server";

import { StreamPlayer } from "@/components/stream-player";
import { getUserByUsername } from "@/lib/user-service";

/**
 * Props for the {@link CreatorPage} component.
 *
 * @interface CreatorPageProps
 *
 * @property {Promise<{ username: string }>} params - Next.js dynamic route
 *   parameters. `username` corresponds to the `[username]` path segment and
 *   identifies the channel/creator being viewed.
 */
interface CreatorPageProps {
  params: Promise<{ username: string }>;
}

/**
 * Server component that renders the creator's own stream management view.
 *
 * ### Access control
 * The page throws an `"Unauthorized"` error (triggering the nearest
 * `error.tsx` boundary) when any of the following conditions are true:
 * - No database user record matches the given `username`.
 * - The authenticated Clerk user's ID does not match the record's
 *   `externalUserId` (i.e., someone else's channel).
 * - The user does not have an associated `stream` record.
 *
 * When access is granted, the stream is rendered with `isFollowing` set to
 * `true`, since creators always implicitly follow their own channel.
 *
 * @async
 * @function CreatorPage
 *
 * @param {CreatorPageProps} props - Component props containing the dynamic
 *   route parameters.
 *
 * @returns {Promise<JSX.Element>} A full-height container wrapping the
 *   {@link StreamPlayer} component pre-configured for the creator.
 *
 * @throws {Error} Throws `"Unauthorized"` if access control checks fail.
 */
export default async function CreatorPage({ params }: CreatorPageProps) {
  const { username } = await params;
  const externalUser = await currentUser();
  const user = await getUserByUsername(username);

  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      {/* isFollowing is always true for the creator viewing their own stream */}
      <StreamPlayer isFollowing stream={user.stream} user={user} />
    </div>
  );
}
