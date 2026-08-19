/**
 * @file app/(dashboard)/u/[username]/community/_components/unblock-button.tsx
 * @description Client component that renders a button to unblock a previously blocked user.
 *
 * Calls the {@link onUnblock} server action and displays a success or error
 * toast depending on the outcome.
 */

"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";

/**
 * Props for the {@link UnblockButton} component.
 *
 * @interface UnblockButtonProps
 * @property {string} userId - The ID of the blocked user to unblock.
 */
interface UnblockButtonProps {
  userId: string;
}

/**
 * UnblockButton component - Renders an inline "Unblock" link-style button.
 *
 * On click, calls the {@link onUnblock} server action with the given `userId`.
 * Displays a success toast with the unblocked user's username on success,
 * or a generic error toast if the action throws. The button is disabled
 * while the transition is pending to prevent duplicate submissions.
 *
 * @param {UnblockButtonProps} props - Component props.
 * @param {string} props.userId - The ID of the user to unblock.
 * @returns {JSX.Element} A button that triggers the unblock action.
 */
export function UnblockButton({ userId }: UnblockButtonProps) {
  const [isPending, startTransition] = useTransition();

  /**
   * Initiates the unblock action inside a React transition.
   * Shows a success or error toast based on the outcome.
   */
  const onClick = () => {
    startTransition(async () => {
      try {
        const result = await onUnblock(userId);
        toast.success(`User ${result.blocked.username} unblocked`);
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Button
      className="w-full text-blue-500"
      disabled={isPending}
      size="sm"
      variant="link"
      onClick={onClick}
    >
      Unblock
    </Button>
  );
}
