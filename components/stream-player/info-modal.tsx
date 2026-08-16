"use client";

import { ComponentRef, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { updateStream } from "@/actions/stream";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing";

/** Props for the {@link InfoModal} component. */
interface InfoModalProps {
  /** The current name/title of the stream. */
  initialName: string;
  /** The current thumbnail URL of the stream, or null if none is set. */
  initialThumbnailUrl: string | null;
}

/**
 * A dialog modal that allows the stream host to update their stream's
 * name and thumbnail image.
 *
 * - The stream name can be updated via a text input.
 * - The thumbnail can be uploaded via a dropzone or removed entirely.
 * - Changes are submitted via the {@link updateStream} server action.
 *
 * @param props - See {@link InfoModalProps}.
 * @returns A dialog containing the stream info edit form.
 */
export const InfoModal = ({
  initialName,
  initialThumbnailUrl,
}: InfoModalProps) => {
  const router = useRouter();

  /** Ref for the hidden close button, used to programmatically close the dialog. */
  const closeRef = useRef<ComponentRef<"button">>(null);

  /** Indicates whether a server transition (update/remove) is in progress. */
  const [isPending, startTransition] = useTransition();

  /** The current value of the stream name input. */
  const [name, setName] = useState(initialName);

  /** The current thumbnail URL, updated after upload or removal. */
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);

  /**
   * Removes the current stream thumbnail by setting it to null in the database.
   * Closes the dialog and shows a success or error toast on completion.
   */
  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Thumbnail removed");
          setThumbnailUrl("");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  /**
   * Handles the stream info form submission.
   * Updates the stream name via the {@link updateStream} server action.
   * Closes the dialog and shows a success or error toast on completion.
   *
   * @param e - The form submit event.
   */
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updateStream({ name: name })
        .then(() => {
          toast.success("Stream updated");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  /**
   * Handles changes to the stream name input field.
   *
   * @param e - The input change event.
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Dialog>
      {/* Trigger button that opens the edit dialog. */}
      <DialogTrigger asChild>
        <Button className="ml-auto" size="sm" variant="link">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form className="space-y-14" onSubmit={onSubmit}>
          {/* Stream name input field. */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              disabled={isPending}
              placeholder="Stream name"
              value={name}
              onChange={onChange}
            />
          </div>
          {/* Thumbnail section: shows the current thumbnail or an upload dropzone. */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                {/* Button to remove the current thumbnail. */}
                <div className="absolute top-2 right-2 z-10">
                  <Hint asChild label="Remove thumbnail" side="left">
                    <Button
                      className="h-auto w-auto p-1.5"
                      disabled={isPending}
                      type="button"
                      onClick={onRemove}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  alt="Thumbnail"
                  className="object-cover"
                  fill
                  src={thumbnailUrl}
                />
              </div>
            ) : (
              /* Dropzone for uploading a new thumbnail image. */
              <div className="rounded-xl border border-dashed border-border">
                <UploadDropzone
                  appearance={{
                    label: {
                      color: "var(--foreground)",
                    },
                    allowedContent: {
                      color: "var(--muted-foreground)",
                    },
                  }}
                  endpoint="thumbnailUploader"
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.url);
                    router.refresh();
                    closeRef?.current?.click();
                  }}
                />
              </div>
            )}
          </div>
          {/* Form action buttons: cancel closes the dialog, save submits the form. */}
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
