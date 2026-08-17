"use client";

import Image from "next/image";

import { PencilIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { InfoModal } from "./info-modal";

/** Props for the {@link InfoCard} component. */
interface InfoCardProps {
  /** The name/title of the stream. */
  name: string;
  /** The URL of the stream's thumbnail image, or null if none is set. */
  thumbnailUrl: string | null;
  /** The identity string of the stream host. */
  hostIdentity: string;
  /** The identity string of the current viewer. */
  viewerIdentity: string;
}

/**
 * Displays a card with the stream's current info (name and thumbnail),
 * and provides an option to edit it via the {@link InfoModal}.
 *
 * Renders only if the current viewer is the host of the stream.
 *
 * @param props - See {@link InfoCardProps}.
 * @returns The stream info card, or null if the viewer is not the host.
 */
export function InfoCard({
  name,
  thumbnailUrl,
  hostIdentity,
  viewerIdentity,
}: InfoCardProps) {
  /** The host's viewer identity string, prefixed with "host-". */
  const hostAsViewer = `host-${hostIdentity}`;

  /** Whether the current viewer is the host of the stream. */
  const isHost = viewerIdentity === hostAsViewer;

  // Only render the info card for the stream host.
  if (!isHost) return null;

  return (
    <div className="px-4">
      <div className="rounded-xl bg-background">
        <div className="flex items-center gap-x-2.5 p-4">
          <div className="h-auto w-auto rounded-md bg-blue-600 p-2 text-white">
            <PencilIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold capitalize lg:text-lg">
              Edit your stream info
            </h2>
            <p className="text-xs text-muted-foreground lg:text-sm">
              Maximize your visibility
            </p>
          </div>
          {/* Button that opens the stream info edit modal. */}
          <InfoModal initialName={name} initialThumbnailUrl={thumbnailUrl} />
        </div>
        <Separator />
        <div className="space-y-4 p-4 lg:p-6">
          {/* Current stream name. */}
          <div>
            <h3 className="mb-2 text-sm text-muted-foreground">Name</h3>
            <p className="text-sm font-semibold">{name}</p>
          </div>
          {/* Current stream thumbnail, shown only if a thumbnail URL exists. */}
          <div>
            <h3 className="mb-2 text-sm text-muted-foreground">Thumbnail</h3>
            {thumbnailUrl && (
              <div className="relative aspect-video w-50 overflow-hidden rounded-md border border-border">
                <Image
                  alt={name}
                  className="object-cover"
                  fill
                  sizes="200px"
                  src={thumbnailUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
