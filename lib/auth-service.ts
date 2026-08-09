import type { User as ClerkUser } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

/**
 * Retrieves the currently authenticated Clerk user and enforces that they
 * are signed in and have a username set.
 *
 * @throws {Error} `"Unauthorized"` — If there is no authenticated Clerk
 * session, or the authenticated user has no username.
 * @returns The authenticated Clerk user.
 */
async function requireAuthenticatedClerkUser(): Promise<ClerkUser> {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  return self;
}

/**
 * Retrieves the local database record for the currently authenticated user.
 *
 * @throws {Error} `"Unauthorized"` — If there is no authenticated Clerk
 * session, or the authenticated user has no username.
 * @throws {Error} `"Not found"` — If no local user record exists for the
 * authenticated Clerk user.
 * @returns The local database user record corresponding to the current
 * Clerk session.
 */
export async function getSelf() {
  const self = await requireAuthenticatedClerkUser();

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
  });

  if (!user) {
    throw new Error("Not found");
  }

  return user;
}

/**
 * Retrieves the local database record for the given username, provided it
 * belongs to the currently authenticated user.
 *
 * @param username - The username of the local user record to retrieve.
 * @throws {Error} `"Unauthorized"` — If there is no authenticated Clerk
 * session, the authenticated user has no username, or the authenticated
 * user's username does not match the requested user's username.
 * @throws {Error} `"User not found"` — If no local user record exists with
 * the given username.
 * @returns The local database user record matching `username`.
 */
export async function getSelfByUsername(username: string) {
  const self = await requireAuthenticatedClerkUser();

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.externalUserId !== self.id) {
    throw new Error("Unauthorized");
  }

  return user;
}
