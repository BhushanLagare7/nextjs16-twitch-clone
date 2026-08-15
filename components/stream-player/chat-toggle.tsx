/**
 * @file components/stream-player/chat-toggle.tsx
 * @description Button that collapses/expands the chat sidebar, backed by
 * the shared {@link useChatSidebar} store.
 *
 * @module ChatToggle
 */

"use client";

import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/store/use-chat-sidebar";

/**
 * Renders an icon button that toggles the collapsed state of the chat
 * sidebar. Shows an "expand" icon/hint when collapsed, and a "collapse"
 * icon/hint otherwise.
 *
 * @function ChatToggle
 * @returns {JSX.Element} The chat collapse/expand toggle button.
 */
export function ChatToggle() {
  const { collapsed, onExpand, onCollapse } = useChatSidebar((state) => state);

  const Icon = collapsed ? ArrowLeftFromLineIcon : ArrowRightFromLineIcon;

  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <Hint asChild label={label} side="left">
      <Button
        className="h-auto bg-transparent p-2 hover:bg-white/10 hover:text-primary"
        variant="ghost"
        onClick={onToggle}
      >
        <Icon className="size-4" />
      </Button>
    </Hint>
  );
}
