/**
 * @file _components/key-card.tsx
 * @description Displays the stream key with show/hide toggle and clipboard copy functionality.
 *
 * The stream key is masked by default (rendered as a password input) and
 * can be revealed using the "Show"/"Hide" toggle button.
 */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CopyButton } from "./copy-button";

/**
 * Props for the KeyCard component.
 */
interface KeyCardProps {
  /** The stream key value to display. Null if no key has been generated yet. */
  value: string | null;
}

/**
 * KeyCard - Client component that displays the user's stream key.
 *
 * Features:
 * - Masked input (password type) to hide the stream key by default.
 * - Toggle button to show or hide the stream key.
 * - Copy button to copy the stream key to the clipboard.
 *
 * @param {KeyCardProps} props - Component props.
 * @returns {JSX.Element} A styled card displaying the stream key with controls.
 */
export function KeyCard({ value }: KeyCardProps) {
  /** Controls whether the stream key is visible or masked. */
  const [show, setShow] = useState(false);

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-start gap-x-10">
        {/* Label */}
        <p className="shrink-0 font-semibold">Stream Key</p>

        <div className="w-full space-y-2">
          {/* Stream key input and copy button */}
          <div className="flex w-full items-center gap-x-2">
            {/*
             * Input field displaying the stream key.
             * Type toggles between "text" and "password" based on `show` state.
             */}
            <Input
              placeholder="Stream key"
              readOnly
              type={show ? "text" : "password"}
              value={value ?? ""}
            />
            {/* Button to copy the stream key to the clipboard */}
            <CopyButton value={value ?? ""} />
          </div>

          {/* Toggle button to show or hide the stream key */}
          <Button size="sm" variant="link" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
    </div>
  );
}
