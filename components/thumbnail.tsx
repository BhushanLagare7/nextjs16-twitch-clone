/**
 * @file components/thumbnail.tsx
 * @description Provides the {@link Thumbnail} and {@link ThumbnailSkeleton}
 * components used to display stream preview images or a fallback avatar within
 * stream result cards and the stream player header.
 */

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

import { LiveBadge } from "./live-badge";

/**
 * Props for the {@link Thumbnail} component.
 *
 * @interface ThumbnailProps
 * @property {string | null} src      - URL of the stream thumbnail image.
 *                                      When `null`, a fallback avatar is rendered
 *                                      instead of the thumbnail image.
 * @property {string}        fallback - URL of the user's profile image, used
 *                                      when no thumbnail is available.
 * @property {boolean}       isLive   - Whether the stream is currently live.
 *                                      Passed to {@link UserAvatar} for the live
 *                                      indicator and used to conditionally render
 *                                      the {@link LiveBadge}.
 * @property {string}        username - The streamer's username, used for the
 *                                      image `alt` attribute and avatar display.
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
 * When a valid `src` URL is provided, renders the stream thumbnail as a
 * Next.js `Image` that fills its container with `object-cover` styling.
 * When `src` is `null`, renders the streamer's {@link UserAvatar} centered
 * within the container as a fallback.
 *
 * A semi-transparent blue overlay appears on hover for interactive visual
 * feedback, and a {@link LiveBadge} is shown in the top-left corner when
 * both `isLive` is `true` and a thumbnail `src` is present.
 *
 * @param {ThumbnailProps} props          - Component props.
 * @param {string | null}  props.src      - URL of the stream thumbnail.
 *                                          Renders a fallback avatar if `null`.
 * @param {string}         props.fallback - Fallback profile image URL.
 * @param {boolean}        props.isLive   - Indicates whether the stream is live.
 * @param {string}         props.username - The streamer's username.
 * @returns {JSX.Element} A thumbnail image or a fallback avatar within a
 *   styled container, with an optional live badge overlay.
 *
 * @example
 * // With a thumbnail
 * <Thumbnail
 *   src="https://example.com/thumbnail.jpg"
 *   fallback="https://example.com/avatar.jpg"
 *   isLive={true}
 *   username="streamer123"
 * />
 *
 * @example
 * // Without a thumbnail — renders the fallback avatar
 * <Thumbnail
 *   src={null}
 *   fallback="https://example.com/avatar.jpg"
 *   isLive={false}
 *   username="streamer123"
 * />
 */
export function Thumbnail({ src, fallback, isLive, username }: ThumbnailProps) {
  let content;

  if (!src) {
    /**
     * Fallback content: renders the user's avatar centered within
     * the thumbnail container when no thumbnail URL is provided.
     */
    content = (
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-md bg-background transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
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
     * Primary content: renders the stream thumbnail as a Next.js `Image`
     * that fills its container using `object-cover` to prevent distortion.
     */
    content = (
      <Image
        alt={`${username}'s stream thumbnail`}
        className="rounded-md object-cover transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 256px"
        src={src}
      />
    );
  }

  return (
    <div className="group relative aspect-video cursor-pointer rounded-md">
      {/* Semi-transparent blue overlay — visible on hover for interactive feedback */}
      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
      {content}
      {/* LiveBadge is only shown when the stream is live AND a thumbnail is available */}
      {isLive && src && (
        <div className="absolute top-2 left-2 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
          <LiveBadge />
        </div>
      )}
    </div>
  );
}

/**
 * ThumbnailSkeleton component - Animated loading placeholder for {@link Thumbnail}.
 *
 * Renders a skeleton block matching the aspect ratio and shape of the
 * {@link Thumbnail} component. Used within {@link ResultCardSkeleton} while
 * stream data is being fetched.
 *
 * @returns {JSX.Element} An animated skeleton placeholder for the thumbnail area.
 *
 * @example
 * <ThumbnailSkeleton />
 */
export function ThumbnailSkeleton() {
  return (
    <div className="group relative aspect-video cursor-pointer rounded-xl">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
