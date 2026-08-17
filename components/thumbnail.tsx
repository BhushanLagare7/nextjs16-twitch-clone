/**
 * @file thumbnail.tsx
 * @description Provides the `Thumbnail` and `ThumbnailSkeleton` components
 * used to display stream preview images or a fallback avatar within
 * stream result cards.
 */

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

/**
 * Props for the `Thumbnail` component.
 *
 * @interface ThumbnailProps
 * @property {string | null} src       - URL of the stream thumbnail image.
 *                                       Renders a fallback avatar if null.
 * @property {string}        fallback  - URL of the user's profile image,
 *                                       used when no thumbnail is available.
 * @property {boolean}       isLive    - Whether the stream is currently live.
 *                                       Passed to `UserAvatar` for the live indicator.
 * @property {string}        username  - The streamer's username, used for
 *                                       accessibility and avatar display.
 */
interface ThumbnailProps {
  src: string | null;
  fallback: string;
  isLive: boolean;
  username: string;
}

/**
 * Thumbnail component - Displays a stream's preview image or a fallback avatar.
 *
 * Renders the stream's thumbnail image when a valid `src` is provided.
 * If `src` is null, displays the streamer's `UserAvatar` as a fallback.
 * Includes a blue overlay on hover for interactive visual feedback.
 *
 * @param {ThumbnailProps} props             - Component props.
 * @param {string | null}  props.src         - URL of the stream thumbnail.
 * @param {string}         props.fallback    - Fallback profile image URL.
 * @param {boolean}        props.isLive      - Indicates if the stream is live.
 * @param {string}         props.username    - The streamer's username.
 * @returns {JSX.Element} A thumbnail image or a fallback avatar within a styled container.
 */
export function Thumbnail({ src, fallback, isLive, username }: ThumbnailProps) {
  let content;

  if (!src) {
    /**
     * Fallback content: renders the user's avatar centered within
     * the thumbnail container when no thumbnail URL is provided.
     */
    content = (
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-md bg-background transition-transform group-hover:translate-x-2 group-hover:-translate-y-1">
        <UserAvatar
          imageUrl={fallback}
          isLive={isLive}
          showBadge
          size="lg"
          username={username}
        />
      </div>
    );
  } else {
    /**
     * Primary content: renders the stream thumbnail as a
     * Next.js `Image` that fills its container with `object-cover`.
     */
    content = (
      <Image
        alt={`${username}'s stream thumbnail`}
        className="rounded-md object-cover transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
        fill
        src={src}
      />
    );
  }

  return (
    <div className="group relative aspect-video cursor-pointer rounded-md">
      {/* Blue hover overlay for interactive visual feedback */}
      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
      {content}
    </div>
  );
}

/**
 * ThumbnailSkeleton component - Animated loading placeholder for `Thumbnail`.
 *
 * Renders a skeleton block matching the aspect ratio and shape of
 * the `Thumbnail` component. Used within `ResultCardSkeleton` while
 * stream data is being fetched.
 *
 * @returns {JSX.Element} An animated skeleton placeholder for the thumbnail area.
 */
export function ThumbnailSkeleton() {
  return (
    <div className="group relative aspect-video cursor-pointer rounded-xl">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
