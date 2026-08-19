/**
 * @file app/(dashboard)/u/[username]/community/_components/columns.tsx
 * @description Column definitions for the Community Settings blocked-users DataTable.
 *
 * Defines three columns using TanStack Table v9's typed `columnHelper`:
 * - `username` — sortable, renders a {@link UserAvatar} alongside the username text.
 * - `createdAt` — sortable date the block was created.
 * - `actions` — display column containing an {@link UnblockButton} for each row.
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

import { type DataTableFeatures } from "./data-table-features";
import { UnblockButton } from "./unblock-button";

/**
 * The shape of a single row in the blocked-users DataTable.
 *
 * Derived from a flattened block record produced in `CommunityPage`:
 * - `id`        — the block record's own ID.
 * - `userId`    — the blocked user's ID (used by {@link UnblockButton}).
 * - `imageUrl`  — the blocked user's profile image URL.
 * - `username`  — the blocked user's display name.
 * - `createdAt` — pre-formatted date string (e.g. "14/07/2024").
 */
export type BlockedUser = {
  id: string;
  userId: string;
  imageUrl: string;
  username: string;
  createdAt: string;
};

/**
 * Typed column helper for {@link BlockedUser} rows.
 * Use `accessor` for data-backed columns and `display` for action/UI-only columns.
 */
const columnHelper = createColumnHelper<DataTableFeatures, BlockedUser>();

/**
 * Column definitions for the blocked-users {@link DataTable}.
 *
 * Contains three columns:
 * - `username`  — sortable; renders avatar + username.
 * - `createdAt` — sortable; shows the date the user was blocked.
 * - `actions`   — non-sortable display column; renders an {@link UnblockButton}.
 */
export const columns = columnHelper.columns([
  columnHelper.accessor("username", {
    header: ({ column }) => (
      // Clicking the header toggles ascending/descending sort on the username column.
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDownIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      // Render a user avatar alongside the username text for visual identification.
      <div className="flex items-center gap-x-4">
        <UserAvatar
          imageUrl={row.original.imageUrl}
          username={row.original.username}
        />
        <span>{row.original.username}</span>
      </div>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      // Clicking the header toggles ascending/descending sort on the date column.
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date blocked
        <ArrowUpDownIcon className="ml-2 size-4" />
      </Button>
    ),
  }),
  columnHelper.display({
    id: "actions",
    // Render an unblock button for each row, passing the blocked user's ID.
    cell: ({ row }) => {
      return <UnblockButton userId={row.original.userId} />;
    },
  }),
]);
