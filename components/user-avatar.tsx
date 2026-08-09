/**
 * @file UserAvatar component that renders a user's profile picture with optional
 * live status ring and an overlaid LiveBadge for profile/header contexts.
 */

import { cva, type VariantProps } from "class-variance-authority";

import { LiveBadge } from "@/components/live-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * CVA variant definition for avatar sizing.
 *
 * Variants:
 * - `default`: 32×32px — used in sidebar user items.
 * - `lg`: 56×56px — used in profile headers or stream pages.
 */
const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Props for the UserAvatar component. */
interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  /** The user's username, used for the avatar fallback initials. */
  username: string;
  /** URL of the user's profile image. */
  imageUrl: string;
  /**
   * Whether the user is currently live streaming.
   * When `true`, adds a rose-colored ring around the avatar.
   */
  isLive?: boolean;
  /**
   * Whether to display the `LiveBadge` overlay beneath the avatar.
   * Only shown when both `showBadge` and `isLive` are `true`.
   * Typically used in larger display contexts such as profile headers.
   */
  showBadge?: boolean;
}

/**
 * UserAvatar Component
 *
 * Renders a user's circular profile avatar with optional live status indicators.
 *
 * Features:
 * - Displays the user's profile image; falls back to first and last character
 *   of the username if the image fails to load.
 * - Applies a rose-colored ring (`ring-rose-500`) around the avatar when the user is live.
 * - Optionally overlays a `LiveBadge` below the avatar when `showBadge` and `isLive` are both `true`.
 * - Supports `default` (32px) and `lg` (56px) size variants via CVA.
 *
 * @param {UserAvatarProps} props - Props for rendering the user avatar.
 * @returns {JSX.Element} The user's avatar with optional live indicators.
 *
 * @example
 * // Default size, sidebar usage
 * <UserAvatar username="johndoe" imageUrl="/avatar.jpg" isLive={true} />
 *
 * @example
 * // Large size with LiveBadge overlay, profile header usage
 * <UserAvatar
 *   username="johndoe"
 *   imageUrl="/avatar.jpg"
 *   isLive={true}
 *   showBadge={true}
 *   size="lg"
 * />
 */
export function UserAvatar({
  username,
  imageUrl,
  isLive,
  showBadge,
  size,
}: UserAvatarProps) {
  // The LiveBadge overlay is shown only when both showBadge and isLive are true
  const canShowBadge = showBadge && isLive;

  return (
    <div className="relative">
      <Avatar
        className={cn(
          // Apply live ring styling when the user is streaming
          isLive && "border border-background ring-2 ring-rose-500",
          avatarSizes({ size }),
        )}
      >
        <AvatarImage className="object-cover" src={imageUrl} />
        {/* Fallback: first and last characters of the username */}
        <AvatarFallback>
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
      </Avatar>
      {/* Centered LiveBadge overlaid below the avatar circle */}
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 transform">
          <LiveBadge />
        </div>
      )}
    </div>
  );
}

/** Props for the UserAvatarSkeleton component. */
type UserAvatarSkeletonProps = VariantProps<typeof avatarSizes>;

/**
 * UserAvatarSkeleton Component
 *
 * A circular skeleton placeholder rendered while a user's avatar is loading.
 * Supports the same `size` variants as `UserAvatar` (`default` and `lg`).
 *
 * @param {UserAvatarSkeletonProps} props - Props containing the optional `size` variant.
 * @returns {JSX.Element} A rounded skeleton element matching the avatar's dimensions.
 *
 * @example
 * <UserAvatarSkeleton size="lg" />
 */
export function UserAvatarSkeleton({ size }: UserAvatarSkeletonProps) {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
}
