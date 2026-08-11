import { Skeleton } from "@/components/ui/skeleton";

import { ToggleCardSkeleton } from "./_components/toggle-card";

/**
 * Loading skeleton for the chat settings page, shown while `ChatPage`'s
 * data is being fetched. Mirrors the page layout with a title placeholder
 * and three toggle card placeholders.
 */
export default function ChatLoading() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-10 w-50" />
      <div className="space-y-4">
        <ToggleCardSkeleton />
        <ToggleCardSkeleton />
        <ToggleCardSkeleton />
      </div>
    </div>
  );
}
