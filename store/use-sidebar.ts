/**
 * @file Global Zustand store for managing sidebar UI state.
 * Provides a shared, reactive state for the sidebar's
 * collapsed/expanded status and the actions to change it.
 */

import { create } from "zustand";

/**
 * Interface defining the shape of the sidebar store.
 */
interface SidebarStore {
  /**
   * Whether the sidebar is currently collapsed.
   * - `true`: Sidebar is collapsed (narrow width).
   * - `false`: Sidebar is expanded (full width).
   */
  collapsed: boolean;

  /**
   * Action to expand the sidebar.
   * Sets `collapsed` to `false`.
   */
  onExpand: () => void;

  /**
   * Action to collapse the sidebar.
   * Sets `collapsed` to `true`.
   */
  onCollapse: () => void;
}

/**
 * useSidebar
 *
 * A Zustand store hook for managing the global sidebar state.
 *
 * Provides:
 * - `collapsed` (`boolean`): The current collapsed/expanded state.
 * - `onExpand` (`() => void`): Expands the sidebar by setting `collapsed` to `false`.
 * - `onCollapse` (`() => void`): Collapses the sidebar by setting `collapsed` to `true`.
 *
 * The store is initialized with the sidebar **expanded** (`collapsed: false`).
 *
 * @returns {SidebarStore} The sidebar state and action methods.
 *
 * @example
 * // Reading state and dispatching actions in a component:
 * const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);
 *
 * @example
 * // Selectively subscribing to only the collapsed value:
 * const collapsed = useSidebar((state) => state.collapsed);
 */
export const useSidebar = create<SidebarStore>((set) => ({
  /** Initial state: sidebar is expanded */
  collapsed: false,

  /** Expands the sidebar by setting collapsed to false */
  onExpand: () => set(() => ({ collapsed: false })),

  /** Collapses the sidebar by setting collapsed to true */
  onCollapse: () => set(() => ({ collapsed: true })),
}));
