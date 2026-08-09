/**
 * @file Hint component that wraps content with an accessible tooltip.
 * Built on top of the Radix UI Tooltip primitives.
 */

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Props for the Hint component.
 */
interface HintProps {
  /** The text content to display inside the tooltip. */
  label: string;

  /** The element(s) that trigger the tooltip on hover/focus. */
  children: React.ReactNode;

  /**
   * When `true`, the tooltip trigger renders as its child element
   * instead of a wrapping `<button>`, using Radix's `asChild` pattern.
   * @default false
   */
  asChild?: boolean;

  /**
   * The preferred side of the trigger to display the tooltip.
   * Radix UI will automatically adjust if there is insufficient space.
   * @default "top" (Radix UI default)
   */
  side?: "top" | "bottom" | "left" | "right";

  /**
   * The preferred alignment of the tooltip relative to the trigger.
   * @default "center" (Radix UI default)
   */
  align?: "start" | "center" | "end";
}

/**
 * Hint Component
 *
 * A reusable tooltip wrapper that displays a short descriptive label
 * when users hover over or focus on the wrapped child element.
 *
 * Internally uses:
 * - `TooltipProvider`: Provides shared tooltip context (delay, etc.).
 * - `Tooltip`: The root tooltip component with zero delay by default.
 * - `TooltipTrigger`: Wraps the child element that activates the tooltip.
 * - `TooltipContent`: The styled content panel that displays the label.
 *
 * @param {HintProps} props - Component props.
 * @param {string} props.label - Text to display inside the tooltip.
 * @param {React.ReactNode} props.children - The trigger element.
 * @param {boolean} [props.asChild] - Whether to render trigger as its child element.
 * @param {"top"|"bottom"|"left"|"right"} [props.side] - Preferred tooltip placement.
 * @param {"start"|"center"|"end"} [props.align] - Tooltip alignment relative to trigger.
 * @returns {JSX.Element} A tooltip-wrapped version of the provided children.
 *
 * @example
 * <Hint label="Collapse sidebar" side="right">
 *   <Button variant="ghost">
 *     <ArrowLeftFromLineIcon />
 *   </Button>
 * </Hint>
 *
 * @example
 * // Using asChild to avoid wrapping button-in-button issues
 * <Hint asChild label="Expand" side="right">
 *   <Button variant="ghost" onClick={onExpand}>
 *     <ArrowRightFromLineIcon />
 *   </Button>
 * </Hint>
 */
export function Hint({ label, children, asChild, side, align }: HintProps) {
  return (
    /* Provides tooltip context; delayDuration=0 for immediate display */
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        {/* Trigger: the element that shows the tooltip on interaction */}
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>

        {/* Content: the tooltip bubble with custom light/dark styling */}
        <TooltipContent
          align={align}
          className="border border-border/50 bg-white text-black shadow-md dark:border-none"
          side={side}
        >
          <p className="font-semibold">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
