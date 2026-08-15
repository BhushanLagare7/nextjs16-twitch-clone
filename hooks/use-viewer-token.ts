/**
 * @file hooks/use-viewer-token.ts
 * @description Custom React hook for fetching and decoding a LiveKit viewer token.
 *
 * Abstracts the async token lifecycle — creation, JWT decoding, and local
 * state management — so that consumer components receive the resolved
 * `token`, `name`, `identity`, `isLoading`, and `error` values reactively.
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
 * 2. Decodes the JWT to extract the `name` (display name) and `sub`
 *    (`sub` claim, used as the LiveKit participant identity).
 * 3. Stores each value in local state; components re-render automatically
 *    once all values are resolved.
 * 4. On failure, displays a toast notification, sets `error` to a
 *    descriptive message, and clears `isLoading`.
 * 5. Stale requests (from a previous `hostIdentity`) are ignored via a
 *    cancellation flag set in the effect cleanup.
 *
 * @function useViewerToken
 *
 * @param {string} hostIdentity - The database ID of the stream host. Used
 *   to request a room-scoped viewer token. The effect re-runs whenever
 *   this value changes.
 *
 * @returns {{ token: string; name: string; identity: string; isLoading: boolean; error: string }} An object
 *   containing:
 *   - `token` — The raw signed LiveKit JWT string (empty until resolved).
 *   - `name` — The viewer's display name decoded from the JWT (empty until
 *     resolved).
 *   - `identity` — The viewer's LiveKit participant identity (`sub` claim),
 *     empty until resolved.
 *   - `isLoading` — `true` while the token request is in flight.
 *   - `error` — Non-empty error message when the request fails permanently.
 */
export function useViewerToken(hostIdentity: string) {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear stale state immediately when the host changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken("");
    setName("");
    setIdentity("");
    setIsLoading(true);
    setError("");

    let cancelled = false;

    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);

        if (cancelled) return;

        // Decode the JWT before committing any state so a decode failure
        // never leaves the hook in a partially-updated state.
        const decodedToken = jwtDecode(viewerToken) as JwtPayload & {
          name?: string;
        };

        // LiveKit stores the participant identity in the `sub` (subject) claim.
        const participantIdentity = decodedToken.sub;
        const participantName = decodedToken?.name;

        setToken(viewerToken);

        if (participantIdentity) {
          setIdentity(participantIdentity);
        }

        if (participantName) {
          setName(participantName);
        }

        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setIsLoading(false);
        setError("Failed to connect to stream");
        toast.error("Something went wrong");
      }
    };

    createToken();

    return () => {
      cancelled = true;
    };
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
    isLoading,
    error,
  };
}
