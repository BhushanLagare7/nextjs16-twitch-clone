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
 * Retrieves a single user record from the database by their username,
 * including their associated `stream` relation and follower count.
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
 * @returns {Promise<(import("@/generated/prisma").User & {
 *   stream: import("@/generated/prisma").Stream | null;
 *   _count: { followedBy: number };
 * }) | null>} A promise that resolves to the matching Prisma `User` record
 *   with its `stream` relation and `_count.followedBy` aggregate included,
 *   or `null` if not found.
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
    include: {
      stream: true,
      _count: {
        select: {
          followedBy: true,
        },
      },
    },
  });

  return user;
}

/**
 * Retrieves a single user record from the database by their internal ID,
 * including their associated `stream` relation.
 *
 * Performs a unique lookup using the `id` field (the database primary key).
 * Returns `null` if no user with the given ID exists.
 *
 * @async
 * @function getUserById
 *
 * @param {string} id - The unique internal database ID of the user.
 *
 * @returns {Promise<(import("@/generated/prisma").User & {
 *   stream: import("@/generated/prisma").Stream | null;
 * }) | null>} A promise that resolves to the matching Prisma `User` record
 *   with its `stream` relation included, or `null` if not found.
 *
 * @example
 * const user = await getUserById("clx1abc2def3ghi4jkl5");
 * if (!user) {
 *   throw new Error("User not found");
 * }
 */
export async function getUserById(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      stream: true,
    },
  });

  return user;
}
