"use client";

import { MaximizeIcon, MinimizeIcon } from "lucide-react";

import { Hint } from "@/components/hint";

/**
 * Props for the {@link FullscreenControl} component.
 *
 * @interface FullscreenControlProps
 *
 * @property {boolean} isFullscreen - Whether the player is currently in
 *   fullscreen mode. Determines which icon and hint label are shown.
 * @property {() => void} onToggle - Callback fired when the user clicks the
 *   button to enter or exit fullscreen mode.
 */
interface FullscreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

/**
 * Renders a button that toggles fullscreen mode.
 *
 * Shows a "maximize" icon when not fullscreen and a "minimize" icon when
 * fullscreen, wrapped in a tooltip {@link Hint} describing the action.
 *
 * @function FullscreenControl
 *
 * @param {FullscreenControlProps} props - Component props.
 *
 * @returns {JSX.Element} A fullscreen toggle button with a tooltip hint.
 */
export function FullscreenControl({
  isFullscreen,
  onToggle,
}: FullscreenControlProps) {
  const Icon = isFullscreen ? MinimizeIcon : MaximizeIcon;

  const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div className="flex items-center justify-center gap-4">
      <Hint asChild label={label}>
        <button
          className="rounded-lg p-1.5 text-white hover:bg-white/10"
          onClick={onToggle}
        >
          <Icon className="size-5" />
        </button>
      </Hint>
    </div>
  );
}
