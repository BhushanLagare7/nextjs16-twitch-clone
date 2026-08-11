"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

/** The boolean stream fields that can be toggled via `ToggleCard`. */
type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
  /** Human-readable label describing the setting. */
  label: string;
  /** Current value of the toggle. Defaults to `false` if not provided. */
  value: boolean;
  /** The stream field this toggle controls. */
  field: FieldTypes;
}

/**
 * A card containing a labeled switch used to toggle a single boolean
 * stream setting.
 *
 * While the update is in flight, the switch is disabled. On completion, a
 * success or error toast is shown depending on the outcome of the
 * `updateStream` server action.
 */
export function ToggleCard({ label, value = false, field }: ToggleCardProps) {
  const [isPending, startTransition] = useTransition();

  const onChange = () => {
    startTransition(() => {
      updateStream({ [field]: !value })
        .then(() => toast.success("Chat settings updated!"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center justify-between">
        <p className="shrink-0 font-semibold">{label}</p>
        <div className="space-y-2">
          <Switch
            checked={value}
            disabled={isPending}
            onCheckedChange={onChange}
          >
            {value ? "On" : "Off"}
          </Switch>
        </div>
      </div>
    </div>
  );
}

/** Placeholder skeleton rendered in place of a `ToggleCard` while loading. */
export function ToggleCardSkeleton() {
  return <Skeleton className="w-full rounded-xl p-10" />;
}
