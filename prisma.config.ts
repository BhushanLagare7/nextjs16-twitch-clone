/**
 * @file prisma.config.ts
 * @description Prisma configuration file that defines the database schema location,
 * migration settings, and datasource connection for the application.
 *
 * Loads environment variables from a `.env` file using `dotenv` before
 * Prisma reads any configuration values.
 *
 * @requires dotenv - Loads environment variables from `.env` file into `process.env`
 * @requires prisma/config - Provides `defineConfig` and `env` utilities from Prisma
 */
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

/**
 * Prisma configuration object.
 *
 * @property {string} schema - Path to the Prisma schema file.
 * @property {object} migrations - Migration-related settings.
 * @property {string} migrations.path - Directory where migration files are stored.
 * @property {object} datasource - Database connection settings.
 * @property {string} datasource.url - Database connection URL, read from the
 *                                     `DATABASE_URL` environment variable.
 *
 * @example
 * // .env
 * DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
