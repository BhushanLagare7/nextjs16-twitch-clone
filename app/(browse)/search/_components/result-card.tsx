/**
 * @file app/(browse)/search/_components/result-card.tsx
 * @description Provides the {@link ResultCard} and {@link ResultCardSkeleton}
 * components used to display individual stream search results and their
 * corresponding loading placeholders.
 */

import Link from "next/link";

import { formatDistanceToNow } from "date-fns";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifiedMark } from "@/components/verified-mark";
import { Stream, User } from "@/generated/prisma";

/**
 * Props for the {@link ResultCard} component.
 *
 * @interface ResultCardProps
 * @property {Stream & { user: Pick<User, "username" | "imageUrl"> }} data - A
 *   Prisma `Stream` record joined with a narrowed `User` payload (containing
 *   only `username` and `imageUrl`). Provides all data required to render
 *   the card: the stream thumbnail, live status, name, last-updated timestamp,
 *   and the streamer's username and profile image.
 */
interface ResultCardProps {
  data: Stream & {
    user: Pick<User, "username" | "imageUrl">;
  };
}

/**
 * ResultCard component - Displays a single stream search result.
 *
 * Renders a clickable card that links to the streamer's channel page. Each
 * card shows the stream {@link Thumbnail}, the streamer's username with a
 * {@link VerifiedMark}, the stream name, and how long ago the stream was
 * last updated (formatted with `date-fns`).
 *
 * @param {ResultCardProps} props - Component props.
 * @param {Stream & { user: Pick<User, "username" | "imageUrl"> }} props.data -
 *   The stream and narrowed user data used to populate the card.
 * @returns {JSX.Element} A linked stream result card.
 *
 * @example
 * <ResultCard data={streamWithUser} />
 */
export function ResultCard({ data }: ResultCardProps) {
  return (
    <Link href={`/${data.user.username}`}>
      <div className="flex w-full gap-x-4">
        {/* Thumbnail container — fixed dimensions to maintain layout consistency */}
        <div className="relative h-36 w-64">
          <Thumbnail
            fallback={data.user.imageUrl}
            isLive={data.isLive}
            src={data.thumbnailUrl}
            username={data.user.username}
          />
        </div>

        {/* Stream metadata: username, stream name, and last-updated time */}
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <p className="cursor-pointer text-lg font-bold hover:text-blue-500">
              {data.user.username}
            </p>
            <VerifiedMark />
          </div>
          <p className="text-sm text-muted-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {/* Render relative time, e.g. "about 2 hours ago" */}
            {formatDistanceToNow(new Date(data.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * ResultCardSkeleton component - Animated loading placeholder for {@link ResultCard}.
 *
 * Mirrors the layout of {@link ResultCard} with skeleton blocks in place of
 * the thumbnail, username, stream name, and timestamp. Rendered by
 * {@link ResultsSkeleton} while search results are being fetched.
 *
 * @returns {JSX.Element} An animated skeleton placeholder for a result card.
 *
 * @example
 * <ResultCardSkeleton />
 */
export function ResultCardSkeleton() {
  return (
    <div className="flex w-full gap-x-4">
      {/* Thumbnail placeholder */}
      <div className="relative h-36 w-64">
        <ThumbnailSkeleton />
      </div>

      {/* Metadata placeholders: username, stream name, timestamp */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
