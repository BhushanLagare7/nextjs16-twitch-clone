/**
 * @file result-card.tsx
 * @description Provides the `ResultCard` and `ResultCardSkeleton` components
 * used to display individual stream results in a responsive grid layout.
 */

import Link from "next/link";

import { LiveBadge } from "@/components/live-badge";
import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { User } from "@/generated/prisma";

/**
 * Props for the `ResultCard` component.
 *
 * @interface ResultCardProps
 * @property {object}          data               - The stream data to display.
 * @property {User}            data.user          - The user/streamer associated with the stream.
 * @property {boolean}         data.isLive        - Whether the stream is currently live.
 * @property {string}          data.name          - The display name/title of the stream.
 * @property {string | null}   data.thumbnailUrl  - URL of the stream thumbnail, or null if unavailable.
 */
interface ResultCardProps {
  data: {
    user: User;
    isLive: boolean;
    name: string;
    thumbnailUrl: string | null;
  };
}

/**
 * ResultCard component - Displays a single stream result card.
 *
 * Renders a clickable card linking to the streamer's profile page,
 * including the stream thumbnail, an optional live badge (when live),
 * the user avatar, stream name, and the streamer's username.
 *
 * @param {ResultCardProps} props - Component props.
 * @param {ResultCardProps["data"]} props.data - The stream data to display.
 * @returns {JSX.Element} A linked card displaying stream information.
 */
export function ResultCard({ data }: ResultCardProps) {
  return (
    <Link href={`/${data.user.username}`}>
      <div className="h-full w-full space-y-4">
        {/* Stream thumbnail with fallback to the user's profile image */}
        <Thumbnail
          fallback={data.user.imageUrl}
          isLive={data.isLive}
          src={data.thumbnailUrl}
          username={data.user.username}
        />

        {/* Live badge - only shown when the stream is currently active */}
        {data.isLive && (
          <div className="absolute top-2 left-2 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
            <LiveBadge />
          </div>
        )}

        {/* User info: avatar, stream name, and username */}
        <div className="flex gap-x-3">
          <UserAvatar
            imageUrl={data.user.imageUrl}
            isLive={data.isLive}
            username={data.user.username}
          />
          <div className="flex flex-col overflow-hidden text-sm">
            {/* Stream name - truncated if it overflows */}
            <p className="truncate font-semibold hover:text-blue-500">
              {data.name}
            </p>
            <p className="text-muted-foreground">{data.user.username}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * ResultCardSkeleton component - Placeholder skeleton for `ResultCard`.
 *
 * Renders an animated loading skeleton that mirrors the layout of
 * `ResultCard`. Used as a fallback while stream data is being fetched.
 *
 * @returns {JSX.Element} A skeleton placeholder matching the ResultCard layout.
 */
export function ResultCardSkeleton() {
  return (
    <div className="h-full w-full space-y-4">
      {/* Skeleton for the stream thumbnail */}
      <ThumbnailSkeleton />

      {/* Skeleton for the user avatar, stream name, and username */}
      <div className="flex gap-x-3">
        <UserAvatarSkeleton />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" /> {/* Stream name placeholder */}
          <Skeleton className="h-3 w-24" /> {/* Username placeholder */}
        </div>
      </div>
    </div>
  );
}
