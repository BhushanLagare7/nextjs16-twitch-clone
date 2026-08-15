/**
 * @file eslint.config.mjs
 * @description ESLint flat configuration for a Next.js + TypeScript project.
 *
 * This configuration extends Next.js recommended rule sets and enforces
 * additional code style rules for consistent JSX prop ordering and
 * deterministic import/export sorting across the codebase.
 *
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files | ESLint Flat Config}
 * @see {@link https://nextjs.org/docs/app/building-your-application/configuring/eslint | Next.js ESLint}
 * @see {@link https://github.com/lydell/eslint-plugin-simple-import-sort | simple-import-sort}
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * The root ESLint flat configuration array.
 *
 * Rule sets are applied in the order they are defined. Later entries
 * can override rules from earlier ones, so the custom rule blocks
 * are intentionally placed after the Next.js base configs.
 *
 * Included rule sets (in order):
 *  1. `nextVitals`  — Next.js Core Web Vitals rules (extends `eslint-config-next`).
 *  2. `nextTs`      — Next.js TypeScript-specific rules.
 *  3. `globalIgnores` — Paths that ESLint should never lint.
 *  4. `custom/jsx-sort-props` — Enforces a consistent JSX prop ordering.
 *  5. `custom/import-sort`   — Enforces deterministic import/export ordering.
 */
const eslintConfig = defineConfig([
  // ─── Base Rule Sets ────────────────────────────────────────────────────────

  /**
   * Next.js Core Web Vitals rule set.
   * Includes rules that directly affect performance metrics (LCP, CLS, FID).
   * @see {@link https://nextjs.org/docs/app/building-your-application/configuring/eslint#core-web-vitals}
   */
  ...nextVitals,

  /**
   * Next.js TypeScript rule set.
   * Adds type-aware linting rules on top of the base Next.js config.
   * @see {@link https://nextjs.org/docs/app/building-your-application/configuring/eslint#typescript}
   */
  ...nextTs,

  // ─── Global Ignores ────────────────────────────────────────────────────────

  /**
   * Paths that ESLint should skip entirely.
   *
   * - `.next/**`        — Next.js build output (auto-generated).
   * - `out/**`          — Static export output (`next export`).
   * - `build/**`        — Generic build artifacts.
   * - `next-env.d.ts`   — Auto-generated Next.js TypeScript ambient declarations.
   *
   * @see {@link https://eslint.org/docs/latest/use/configure/ignore | ESLint ignore patterns}
   */
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "generated/**",
  ]),

  // ─── Custom: JSX Prop Ordering ─────────────────────────────────────────────

  {
    /**
     * Configuration name — used in ESLint error output for easier debugging.
     * Follows the recommended `owner/rule-topic` naming convention.
     */
    name: "custom/jsx-sort-props",

    rules: {
      /**
       * Enforces a consistent, predictable ordering of JSX props.
       *
       * Ordering priorities (highest → lowest):
       *  1. Reserved props (`key`, `ref`) are always placed first.
       *  2. All remaining props are sorted alphabetically (case-insensitive).
       *  3. Event-handler / callback props (e.g. `onClick`, `onChange`) are
       *     moved to the end so structural props are easier to scan.
       *
       * Option breakdown:
       * @property {boolean} callbacksLast       - Moves event-handler props (functions) to the end of the prop list.
       * @property {boolean} shorthandFirst      - Does NOT force boolean shorthand props (e.g. `disabled`) before others.
       * @property {boolean} ignoreCase          - Sorting is case-insensitive (`aria-label` before `Bar`).
       * @property {boolean} noSortAlphabetically - `false` means alphabetical sorting IS enforced.
       * @property {boolean} reservedFirst       - `key` and `ref` are always placed before all other props.
       *
       * @see {@link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md | react/jsx-sort-props}
       *
       * @example
       * // ✅ Correct
       * <Input
       *   key={id}
       *   ref={inputRef}
       *   aria-label="Email"
       *   className="input"
       *   type="email"
       *   onChange={handleChange}
       *   onSubmit={handleSubmit}
       * />
       *
       * // ❌ Incorrect — `onChange` before structural props, `key` not first
       * <Input
       *   onChange={handleChange}
       *   type="email"
       *   key={id}
       * />
       */
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
    },
  },

  // ─── Custom: Import / Export Sorting ──────────────────────────────────────

  {
    /**
     * Configuration name — used in ESLint error output for easier debugging.
     * Follows the recommended `owner/rule-topic` naming convention.
     */
    name: "custom/import-sort",

    /**
     * Registers the `simple-import-sort` plugin, which provides the
     * `simple-import-sort/imports` and `simple-import-sort/exports` rules.
     *
     * @see {@link https://github.com/lydell/eslint-plugin-simple-import-sort | simple-import-sort}
     */
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      /**
       * Enforces a deterministic, grouped import order.
       *
       * Imports are separated into visually distinct blocks by blank lines.
       * Within each block, imports are sorted alphabetically.
       *
       * Block order:
       *
       *  Group 1 — Side-effect imports
       *    Regex: `^\u0000`
       *    Matches bare imports executed purely for their side effects
       *    (e.g. `import "reflect-metadata"`, `import "./styles.css"`).
       *    These are kept at the very top as a best practice.
       *
       *  Group 2 — Framework: React & Next.js
       *    Regex: `^react`, `^next`
       *    Ensures the two foundational libraries are always visible at a glance,
       *    separated from generic third-party dependencies.
       *
       *  Group 3 — Third-party packages
       *    Regex: `^@?\w`
       *    Matches both un-scoped (`lodash`) and scoped (`@tanstack/react-query`)
       *    packages. The `\w` (word character) constraint naturally excludes local
       *    path aliases like `@/` because `/` is not a word character.
       *
       *  Group 4 — Internal project aliases (`@/`)
       *    Regex: `^@/`
       *    Matches the TypeScript path alias convention used by Next.js.
       *    Kept separate to visually distinguish internal modules from npm packages.
       *
       *  Group 5 — Parent directory imports (`..`)
       *    Regex: `^\.\.(?!/?$)`, `^\.\./?$`
       *    Matches all relative imports that traverse upward in the directory tree.
       *
       *  Group 6 — Sibling / current directory imports (`.`)
       *    Regex: `^\.\/(?=.*\/)(?!\/?$)`, `^\.(?!\/?$)`, `^\.\/?\$`
       *    Matches relative imports within the same directory.
       *
       *  Group 7 — Catch-all
       *    Regex: `^`
       *    Captures any import that did not match the groups above,
       *    preventing unexpected lint failures on exotic import paths.
       *
       * @see {@link https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping | Custom grouping docs}
       *
       * @example
       * // ✅ Correct order
       *
       * import "reflect-metadata";          // Group 1 — side-effect
       *
       * import React from "react";          // Group 2 — framework
       * import { notFound } from "next/navigation";
       *
       * import { useQuery } from "@tanstack/react-query"; // Group 3 — third-party
       * import clsx from "clsx";
       *
       * import { Button } from "@/components/ui/button";  // Group 4 — alias
       * import { db } from "@/lib/db";
       *
       * import { helper } from "../utils";  // Group 5 — parent
       *
       * import { util } from "./utils";     // Group 6 — sibling
       */
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Group 1: Side-effect imports (e.g. `import "styles.css"`)
            ["^\\u0000"],

            // Group 2: Framework — React and Next.js
            ["^react", "^next"],

            // Group 3: Third-party packages (scoped and un-scoped).
            // `^@?\w` matches e.g. `lodash` and `@tanstack/react-query`
            // but intentionally excludes local `@/` aliases.
            ["^@?\\w"],

            // Group 4: Internal project path aliases (`@/`)
            ["^@/"],

            // Group 5: Parent directory relative imports (`..`)
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],

            // Group 6: Sibling / current directory relative imports (`.`)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

            // Group 7: Catch-all for anything not matched above
            ["^"],
          ],
        },
      ],

      /**
       * Enforces alphabetical sorting of export statements.
       *
       * Applies the same predictability principle as import sorting — a
       * consistent export order makes it easier to locate exported members,
       * especially in barrel (`index.ts`) files.
       *
       * @see {@link https://github.com/lydell/eslint-plugin-simple-import-sort#sort-exports | Export sorting docs}
       *
       * @example
       * // ✅ Correct
       * export { Apple } from "./apple";
       * export { Banana } from "./banana";
       *
       * // ❌ Incorrect — unsorted
       * export { Banana } from "./banana";
       * export { Apple } from "./apple";
       */
      "simple-import-sort/exports": "error",
    },
  },
]);

export default eslintConfig;
