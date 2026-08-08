/**
 * @file db.ts
 * @description Initializes and exports a singleton instance of the Prisma client
 * configured with a PostgreSQL adapter.
 *
 * In development, the Prisma client instance is attached to the `globalThis` object
 * to prevent multiple instances being created due to hot module replacement (HMR)
 * in frameworks like Next.js.
 *
 * In production, a fresh client instance is always created without caching on `globalThis`.
 *
 * @requires dotenv - Loads environment variables from `.env` file into `process.env`
 * @requires @prisma/adapter-pg - PostgreSQL adapter for Prisma's driver adapters API
 * @requires ../generated/prisma/client - Auto-generated Prisma client
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

/**
 * Creates a new Prisma client instance using the PostgreSQL driver adapter.
 *
 * Reads the `DATABASE_URL` environment variable to establish the connection string.
 * Throws an error early if the variable is missing, preventing unclear runtime failures.
 *
 * @returns {PrismaClient} A configured Prisma client instance connected via the pg adapter.
 * @throws {Error} If the `DATABASE_URL` environment variable is not defined.
 *
 * @example
 * // .env
 * DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
 */
const createPrismaClient = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  /** Initialize the PostgreSQL adapter with the connection string */
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
};

/**
 * Extends the `globalThis` object to include an optional `prisma` property.
 * This augmentation is necessary to safely store the Prisma client instance
 * across hot reloads in non-production environments without TypeScript errors.
 */
declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

/**
 * Singleton Prisma client instance.
 *
 * - Reuses the existing instance from `globalThis.prisma` if available (development).
 * - Creates a new instance via `createPrismaClient()` if none exists (production).
 *
 * @type {PrismaClient}
 */
export const db = globalThis.prisma ?? createPrismaClient();

/**
 * In non-production environments, persist the Prisma client on `globalThis`
 * to avoid exhausting database connections during hot module replacement (HMR).
 *
 * This block is intentionally skipped in production where HMR does not occur.
 */
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
