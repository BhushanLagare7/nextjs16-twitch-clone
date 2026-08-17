/**
 * @file components/stream-player/variant-toggle.tsx
 * @description Button that switches the chat panel between "chat" and
 * "community" variants, backed by the shared {@link useChatSidebar} store.
 *
 * @module VariantToggle
 */

"use client";

import { MessageSquareIcon, UsersIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

/**
 * Renders an icon button that toggles the chat panel's `variant` between
 * {@link ChatVariant.CHAT} and {@link ChatVariant.COMMUNITY}.
 *
 * @function VariantToggle
 * @returns {JSX.Element} The chat/community variant toggle button.
 */
export function VariantToggle() {
  const { variant, onChangeVariant } = useChatSidebar((state) => state);

  const isChat = variant === ChatVariant.CHAT;

  const Icon = isChat ? UsersIcon : MessageSquareIcon;

  const onToggle = () => {
    const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
    onChangeVariant(newVariant);
  };

  const label = isChat ? "Community" : "Go back to chat";

  return (
    <Hint asChild label={label} side="left">
      <Button
        className="h-auto bg-transparent p-2 hover:bg-muted/50 hover:text-primary"
        variant="ghost"
        onClick={onToggle}
      >
        <Icon className="size-4" />
      </Button>
    </Hint>
  );
}
