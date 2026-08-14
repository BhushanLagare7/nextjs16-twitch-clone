"use client";

import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Slider } from "@/components/ui/slider";

/**
 * Props for the {@link VolumeControl} component.
 *
 * @interface VolumeControlProps
 *
 * @property {() => void} onToggle - Callback fired when the mute/unmute
 *   button is clicked.
 * @property {(value: number) => void} onChange - Callback fired with the
 *   new volume value (0-100) when the slider changes.
 * @property {number} value - Current volume level, from 0 (muted) to 100
 *   (max). Determines which speaker icon is shown.
 */
interface VolumeControlProps {
  onToggle: () => void;
  onChange: (value: number) => void;
  value: number;
}

/**
 * Renders a mute/unmute button paired with a volume slider.
 *
 * The icon reflects the current volume: muted, low/mid, or high (>50).
 *
 * @function VolumeControl
 *
 * @param {VolumeControlProps} props - Component props.
 *
 * @returns {JSX.Element} A mute toggle button and volume slider.
 */
export const VolumeControl = ({
  onToggle,
  onChange,
  value,
}: VolumeControlProps) => {
  const isMuted = value === 0;
  const isAboveHalf = value > 50;

  let Icon = Volume1Icon;

  if (isMuted) {
    Icon = VolumeXIcon;
  } else if (isAboveHalf) {
    Icon = Volume2Icon;
  }

  const label = isMuted ? "Unmute" : "Mute";

  /**
   * Adapts the Radix `Slider`'s array-based `onValueChange` payload to the
   * single-number `onChange` prop expected by this component.
   *
   * @param {number[]} value - Slider values (single-thumb, so index 0 is used).
   */
  const handleChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <Hint asChild label={label}>
        <button
          className="rounded-lg p-1.5 text-white hover:bg-white/10"
          onClick={onToggle}
        >
          <Icon className="size-6" />
        </button>
      </Hint>
      <Slider
        className="w-32 cursor-pointer"
        max={100}
        step={1}
        value={[value]}
        onValueChange={handleChange}
      />
    </div>
  );
};
