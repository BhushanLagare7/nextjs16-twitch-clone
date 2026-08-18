/**
 * @file components/stream-player/bio-modal.tsx
 * @description Modal dialog that allows the authenticated host to edit
 * their profile bio directly from the stream player page.
 *
 * Renders a trigger button that opens a {@link Dialog} containing a
 * resizable {@link Textarea}. On submission the {@link updateUser} server
 * action is called inside a `useTransition` to avoid blocking the UI.
 * Success and error states are surfaced via toast notifications.
 *
 * @module BioModal
 */

"use client";

import {
  ComponentRef,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { toast } from "sonner";

import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BIO_MAX_LENGTH } from "@/lib/constants";

/**
 * Props for the {@link BioModal} component.
 *
 * @interface BioModalProps
 *
 * @property {string | null} initialValue - The host's current bio loaded
 *   from the database. Passed as the initial value of the textarea.
 *   `null` is treated as an empty string.
 */
interface BioModalProps {
  initialValue: string | null;
}

/**
 * Renders an "Edit" trigger button that opens a modal dialog for updating
 * the authenticated user's bio.
 *
 * The component manages its own local `value` state, seeded from
 * `initialValue`. On form submission it calls the {@link updateUser} server
 * action wrapped in `startTransition` so the UI remains interactive while
 * the mutation is in-flight. The dialog is closed programmatically via a
 * `ref` on the hidden {@link DialogClose} button after a successful save.
 *
 * @function BioModal
 *
 * @param {BioModalProps} props - Component props.
 *
 * @returns {JSX.Element} A dialog trigger button and the associated modal.
 *
 * @example
 * // Rendered only for the channel owner inside AboutCard
 * <BioModal initialValue={user.bio} />
 */
export function BioModal({ initialValue }: BioModalProps) {
  /**
   * Ref attached to the hidden `DialogClose` button so the dialog can be
   * dismissed programmatically after a successful bio update without
   * requiring controlled open/close state.
   */
  const closeRef = useRef<ComponentRef<"button">>(null);

  /**
   * `isPending` is `true` while the server action is in-flight.
   * Used to disable the textarea and submit button during the transition.
   */
  const [isPending, startTransition] = useTransition();

  /** Local controlled state for the textarea, seeded from `initialValue`. */
  const [value, setValue] = useState(initialValue || "");

  // Reset local value when initialValue changes (e.g. after a successful save
  // revalidates the page and the parent re-renders with fresh data).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(initialValue || "");
  }, [initialValue]);

  /** Controlled open/close state for the dialog. */
  const [open, setOpen] = useState(false);

  /**
   * Handles dialog open/close state changes.
   * Resets the textarea value to the current persisted bio when closing,
   * discarding any unsaved local edits.
   */
  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setValue(initialValue || "");
    }
  };

  /**
   * Handles form submission.
   *
   * Prevents the default browser form submission, then wraps the
   * {@link updateUser} call in a transition. On success a toast is shown
   * and the dialog is closed; on failure an error toast is displayed.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await updateUser({ bio: value });
        toast.success("User bio updated");
        closeRef.current?.click();
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto" size="sm" variant="link">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user bio</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Textarea
            className="resize-none"
            disabled={isPending}
            maxLength={BIO_MAX_LENGTH}
            placeholder="User bio"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex justify-between">
            {/*
             * Hidden close button targeted by `closeRef`.
             * Clicking it closes the dialog without submitting the form.
             */}
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
}
