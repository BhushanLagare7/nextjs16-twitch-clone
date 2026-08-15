/**
 * @file store/use-chat-sidebar.ts
 * @description Zustand store controlling the stream chat panel's
 * collapsed/expanded state and its active variant (chat vs. community).
 *
 * @module useChatSidebar
 */

import { create } from "zustand";

/**
 * The available content variants for the chat sidebar panel.
 *
 * @enum {string} ChatVariant
 * @property {string} CHAT - Standard live chat view.
 * @property {string} COMMUNITY - Community view (placeholder content).
 */
export enum ChatVariant {
  CHAT = "CHAT",
  COMMUNITY = "COMMUNITY",
}

/**
 * Shape of the chat sidebar store.
 *
 * @interface ChatSidebarStore
 *
 * @property {boolean} collapsed - Whether the chat sidebar is currently
 *   collapsed (hidden).
 * @property {ChatVariant} variant - The currently active sidebar variant.
 * @property {() => void} onExpand - Expands (shows) the chat sidebar.
 * @property {() => void} onCollapse - Collapses (hides) the chat sidebar.
 * @property {(variant: ChatVariant) => void} onChangeVariant - Switches the
 *   active sidebar variant.
 */
interface ChatSidebarStore {
  collapsed: boolean;
  variant: ChatVariant;
  onExpand: () => void;
  onCollapse: () => void;
  onChangeVariant: (variant: ChatVariant) => void;
}

/**
 * Zustand hook/store for the chat sidebar's collapsed state and variant.
 *
 * Defaults to expanded (`collapsed: false`) and the standard chat variant
 * (`ChatVariant.CHAT`).
 *
 * @example
 * const { collapsed, onCollapse } = useChatSidebar((state) => state);
 */
export const useChatSidebar = create<ChatSidebarStore>((set) => ({
  collapsed: false,
  variant: ChatVariant.CHAT,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
  onChangeVariant: (variant: ChatVariant) => set(() => ({ variant })),
}));
