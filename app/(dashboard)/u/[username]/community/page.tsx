/**
 * @file app/(dashboard)/u/[username]/community/page.tsx
 * @description Server-rendered Community Settings page.
 *
 * Fetches all users blocked by the currently authenticated user,
 * formats the data for display, and renders a searchable, sortable
 * {@link DataTable} of blocked users with an unblock action per row.
 */

import { getBlockedUsers } from "@/lib/block-service";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

/**
 * CommunityPage component - Displays the Community Settings dashboard page.
 *
 * Retrieves the current user's block list via {@link getBlockedUsers},
 * transforms each record into a flat {@link BlockedUser}-shaped object
 * (extracting `userId`, `imageUrl`, `username`, and the raw `createdAt`
 * date for sortable display), and renders the results in a {@link DataTable}.
 *
 * @returns {Promise<JSX.Element>} The rendered Community Settings page.
 */
export default async function CommunityPage() {
  const blockedUsers = await getBlockedUsers();

  // Flatten each block record so the DataTable columns can access user
  // fields directly (e.g. row.original.username) without traversing nested
  // relations. The raw Date is preserved for chronological sorting;
  // dd/MM/yyyy formatting is applied in the column cell renderer.
  const formattedData = blockedUsers.map((block) => ({
    id: block.id,
    userId: block.blocked.id,
    imageUrl: block.blocked.imageUrl,
    username: block.blocked.username,
    createdAt: block.blocked.createdAt,
  }));

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community Settings</h1>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
}
