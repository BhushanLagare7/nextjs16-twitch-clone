/**
 * @file keys/page.tsx
 * @description Page component for displaying stream keys and server URLs.
 *
 * Fetches the authenticated user's stream information and renders:
 * - A modal to generate a new stream connection
 * - The server URL card
 * - The stream key card
 *
 * @throws {Error} If no stream is found for the authenticated user.
 */

import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

import { ConnectModal } from "./_components/connect-modal";
import { KeyCard } from "./_components/key-card";
import { UrlCard } from "./_components/url-card";

/**
 * KeysPage - Server component that renders the "Keys & URLs" settings page.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered page layout containing the
 * connection modal, server URL card, and stream key card.
 */
export default async function KeysPage() {
  // Retrieve the currently authenticated user
  const self = await getSelf();

  // Retrieve the stream associated with the authenticated user
  const stream = await getStreamByUserId(self.id);

  // Guard: Ensure the stream exists before rendering the page
  if (!stream) {
    throw new Error("Stream not found");
  }

  return (
    <div className="p-6">
      {/* Page header with title and connection modal trigger */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Keys & URLs</h1>
        {/* Modal to generate a new ingress connection */}
        <ConnectModal />
      </div>

      {/* Stream connection details */}
      <div className="space-y-4">
        {/* Displays the server URL with a copy action */}
        <UrlCard value={stream.serverUrl} />
        {/* Displays the stream key with show/hide and copy actions */}
        <KeyCard value={stream.streamKey} />
      </div>
    </div>
  );
}
