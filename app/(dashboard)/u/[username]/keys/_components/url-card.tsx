/**
 * @file _components/url-card.tsx
 * @description Displays the stream server URL with clipboard copy functionality.
 *
 * A read-only input field is used to present the server URL alongside
 * a copy button for convenient clipboard access.
 */

import { Input } from "@/components/ui/input";

import { CopyButton } from "./copy-button";

/**
 * Props for the UrlCard component.
 */
interface UrlCardProps {
  /** The server URL value to display. Null if no URL has been configured yet. */
  value: string | null;
}

/**
 * UrlCard - Server component that displays the user's stream server URL.
 *
 * Features:
 * - Read-only input field showing the server URL.
 * - Copy button to copy the server URL to the clipboard.
 *
 * @param {UrlCardProps} props - Component props.
 * @returns {JSX.Element} A styled card displaying the server URL with a copy action.
 */
export function UrlCard({ value }: UrlCardProps) {
  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center gap-x-10">
        {/* Label */}
        <p className="shrink-0 font-semibold">Server URL</p>

        <div className="w-full space-y-2">
          {/* Server URL input and copy button */}
          <div className="flex w-full items-center gap-x-2">
            {/* Read-only input displaying the server URL */}
            <Input placeholder="Server URL" readOnly value={value ?? ""} />
            {/* Button to copy the server URL to the clipboard */}
            <CopyButton value={value ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
