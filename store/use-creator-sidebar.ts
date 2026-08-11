import { create } from "zustand";

/**
 * State shape for the creator sidebar Zustand store.
 *
 * @property collapsed - Whether the creator sidebar is currently collapsed.
 * @property onExpand - Action that expands the sidebar (`collapsed → false`).
 * @property onCollapse - Action that collapses the sidebar (`collapsed → true`).
 */
interface CreatorSidebarStore {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

/**
 * Zustand store that manages the collapsed/expanded state of the creator
 * dashboard sidebar.
 *
 * @example
 * const { collapsed, onExpand, onCollapse } = useCreatorSidebar();
 */
export const useCreatorSidebar = create<CreatorSidebarStore>((set) => ({
  /** Initial state: sidebar is expanded. */
  collapsed: false,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
}));
