/**
 * @file actions/user.ts
 * @description Server actions for managing the authenticated user's profile.
 *
 * All exports are Next.js Server Actions (`"use server"`), intended to be
 * called directly from client components or forms. Mutations are followed
 * by path revalidation to keep cached pages up to date.
 *
 * @module user-actions
 */

"use server";

import { revalidatePath } from "next/cache";

import { getSelf } from "@/lib/auth-service";
import { BIO_MAX_LENGTH } from "@/lib/constants";
import { db } from "@/lib/db";

/**
 * Updates the authenticated user's profile with the provided values.
 *
 * Only a safe subset of the supplied `values` is written to the database;
 * currently only the `bio` field is accepted. Any other fields present in
 * `values` are silently ignored to prevent mass-assignment vulnerabilities.
 *
 * After a successful update, the user's public profile page and their
 * dashboard settings page are revalidated so that the next request serves
 * fresh data.
 *
 * @async
 * @function updateUser
 *
 * @param {Partial<User>} values - A partial `User` object containing the
 *   fields to update. Only `bio` is applied; all other fields are ignored.
 *
 * @returns {Promise<User>} A promise that resolves to the updated Prisma
 *   `User` record.
 *
 * @throws {Error} If {@link getSelf} cannot resolve the current session
 *   (e.g., the user is unauthenticated), or if the database update fails.
 *
 * @example
 * // Inside a client component
 * await updateUser({ bio: "Hello, world!" });
 */
/**
 * Input accepted by {@link updateUser}.
 *
 * Only `bio` is exposed to prevent mass-assignment of other User fields.
 */
interface UpdateUserInput {
  bio?: string | null;
}

export async function updateUser(values: UpdateUserInput) {
  const self = await getSelf();

  // Trim whitespace and enforce the server-side maximum length.
  const sanitizedBio =
    typeof values.bio === "string"
      ? values.bio.trim().slice(0, BIO_MAX_LENGTH)
      : values.bio;

  /**
   * Allowlist of fields that may be written to the database.
   * Explicitly omitting all other `User` fields prevents unintended
   * mass-assignment of sensitive columns (e.g., `role`, `externalUserId`).
   */
  const validData = {
    bio: sanitizedBio,
  };

  const user = await db.user.update({
    where: { id: self.id },
    data: { ...validData },
  });

  // Revalidate the host's public-facing profile and dashboard settings pages
  // so that cached responses reflect the updated bio immediately.
  revalidatePath(`/${self.username}`);
  revalidatePath(`/u/${self.username}`);

  return user;
}
