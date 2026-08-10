/**
 * @file lib/user-service.ts
 * @description Service functions for retrieving user records from the database.
 *
 * Provides reusable, server-side data-access helpers for user lookups.
 * All functions in this module interact directly with the Prisma client
 * and are intended to be called from async server components or other
 * server-side service modules.
 *
 * @module user-service
 */

import { db } from "@/lib/db";

/**
 * Retrieves a single user record from the database by their username.
 *
 * Performs a unique lookup using the `username` field, which is expected
 * to be a unique constraint in the Prisma schema. Returns `null` if no
 * user with the given username exists.
 *
 * @async
 * @function getUserByUsername
 *
 * @param {string} username - The unique username to search for.
 *
 * @returns {Promise<import("@prisma/client").User | null>} A promise that
 *   resolves to the matching Prisma `User` record, or `null` if not found.
 *
 * @example
 * const user = await getUserByUsername("johndoe");
 * if (!user) {
 *   // Handle missing user (e.g., redirect to 404)
 * }
 */
export async function getUserByUsername(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  return user;
}
