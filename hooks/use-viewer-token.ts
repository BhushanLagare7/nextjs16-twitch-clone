/**
 * @file hooks/use-viewer-token.ts
 * @description Custom React hook for fetching and decoding a LiveKit viewer token.
 *
 * Abstracts the async token lifecycle — creation, JWT decoding, and local
 * state management — so that consumer components receive the resolved
 * `token`, `name`, and `identity` values reactively.
 *
 * @module useViewerToken
 */

import { useEffect, useState } from "react";

import { jwtDecode, type JwtPayload } from "jwt-decode";
import { toast } from "sonner";

import { createViewerToken } from "@/actions/token";

/**
 * Fetches a signed LiveKit viewer token for the given host and extracts
 * the viewer's display name and identity from the decoded JWT payload.
 *
 * ### Lifecycle
 * 1. On mount (or when `hostIdentity` changes), calls the
 *    {@link createViewerToken} server action to obtain a signed JWT.
 * 2. Decodes the JWT to extract the `name` (display name) and `jti`
 *    (JWT ID, used as the LiveKit participant identity).
 * 3. Stores each value in local state; components re-render automatically
 *    once all values are resolved.
 * 4. On failure, displays a toast notification and leaves state as empty
 *    strings, which consumers should treat as a loading/error indicator.
 *
 * @function useViewerToken
 *
 * @param {string} hostIdentity - The database ID of the stream host. Used
 *   to request a room-scoped viewer token. The effect re-runs whenever
 *   this value changes.
 *
 * @returns {{ token: string; name: string; identity: string }} An object
 *   containing:
 *   - `token` — The raw signed LiveKit JWT string (empty until resolved).
 *   - `name` — The viewer's display name decoded from the JWT (empty until
 *     resolved).
 *   - `identity` — The viewer's LiveKit participant identity (`jti` claim),
 *     empty until resolved.
 *
 * @example
 * const { token, name, identity } = useViewerToken("host-user-id-123");
 *
 * if (!token || !name || !identity) {
 *   return <LoadingSpinner />;
 * }
 */
export function useViewerToken(hostIdentity: string) {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);
        setToken(viewerToken);

        // Decode the JWT to retrieve the viewer's display name and identity.
        const decodedToken = jwtDecode(viewerToken) as JwtPayload & {
          name?: string;
        };
        const name = decodedToken?.name;

        // `jti` (JWT ID) is repurposed by LiveKit as the participant identity.
        const identity = decodedToken.jti;

        if (identity) {
          setIdentity(identity);
        }

        if (name) {
          setName(name);
        }
      } catch {
        toast.error("Something went wrong");
      }
    };

    createToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
  };
}
