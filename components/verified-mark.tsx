/**
 * @file components/verified-mark.tsx
 * @description A small badge indicating that a user or channel is verified.
 *
 * Renders a filled blue circle containing a bold white check icon,
 * consistent with typical platform verification badge conventions.
 *
 * @module VerifiedMark
 */

import { CheckIcon } from "lucide-react";

/**
 * Renders a circular verified badge with a bold check icon.
 *
 * Intended to appear inline alongside a username or channel name to
 * indicate verified status. The badge is purely decorative/presentational
 * and carries no interactive behaviour.
 *
 * @function VerifiedMark
 *
 * @returns {JSX.Element} A 16×16px blue circle containing a white
 *   bold check icon.
 *
 * @example
 * <div className="flex items-center gap-x-2">
 *   <h2>{hostName}</h2>
 *   <VerifiedMark />
 * </div>
 */
export function VerifiedMark() {
  return (
    <div className="flex size-4 items-center justify-center rounded-full bg-blue-600 p-0.5">
      <CheckIcon className="size-2.5 stroke-[4px] text-white" />
    </div>
  );
}
