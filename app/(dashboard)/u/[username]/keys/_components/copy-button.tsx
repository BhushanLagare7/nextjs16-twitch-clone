/**
 * @file _components/copy-button.tsx
 * @description A button component for copying a given text value to the clipboard.
 *
 * Displays a copy icon that temporarily switches to a confirmation (double-check)
 * icon for 1 second after a successful copy action.
 */

"use client";

import { useState } from "react";

import { CheckCheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Props for the CopyButton component.
 */
interface CopyButtonProps {
  /** The text value to copy to the clipboard. If undefined, the button is disabled. */
  value?: string;
}

/**
 * CopyButton - Client component that copies a provided value to the clipboard.
 *
 * - Displays a `CopyIcon` by default.
 * - Switches to a `CheckCheckIcon` for 1 second after a successful copy.
 * - Disabled when no value is provided or while the copied state is active.
 *
 * @param {CopyButtonProps} props - Component props.
 * @returns {JSX.Element} A small ghost button with a clipboard copy icon.
 */
export function CopyButton({ value }: CopyButtonProps) {
  /** Tracks whether the value has just been copied to the clipboard. */
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Handles the copy action.
   * Writes the provided value to the clipboard and temporarily
   * sets `isCopied` to true for visual feedback.
   */
  const onCopy = async () => {
    // Prevent copy if no value is provided
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);

      // Reset the copied state after 1 second
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch {
      // Clipboard write failed — leave confirmation state unset
    }
  };

  // Show confirmation icon while copied, otherwise show copy icon
  const Icon = isCopied ? CheckCheckIcon : CopyIcon;

  return (
    <Button
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
      disabled={!value || isCopied}
      size="sm"
      variant="ghost"
      onClick={onCopy}
    >
      <Icon className="size-4" />
    </Button>
  );
}
