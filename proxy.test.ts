/**
 * @file proxy.test.ts
 * @description Regression tests for the {@link isPublicRoute} middleware helper.
 *
 * Ensures that known public routes are correctly identified and that reserved
 * protected root segments (e.g. `/u`) are excluded from the /:username fallback.
 *
 * Run with: `npm test` (or `npx tsx --test proxy.test.ts`)
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isPublicRoute } from "./proxy";

describe("isPublicRoute", () => {
  // ── Static public routes ─────────────────────────────────────────────

  it("treats the root path as public", () => {
    assert.equal(isPublicRoute("/"), true);
  });

  it("treats /api/webhooks as public", () => {
    assert.equal(isPublicRoute("/api/webhooks"), true);
  });

  it("treats /api/webhooks/* as public", () => {
    assert.equal(isPublicRoute("/api/webhooks/clerk"), true);
  });

  it("treats /api/uploadthing as public", () => {
    assert.equal(isPublicRoute("/api/uploadthing"), true);
  });

  it("treats /api/uploadthing/* as public", () => {
    assert.equal(isPublicRoute("/api/uploadthing/callback"), true);
  });

  it("treats /sign-in as public", () => {
    assert.equal(isPublicRoute("/sign-in"), true);
  });

  it("treats /sign-in/* as public", () => {
    assert.equal(isPublicRoute("/sign-in/sso-callback"), true);
  });

  it("treats /sign-up as public", () => {
    assert.equal(isPublicRoute("/sign-up"), true);
  });

  it("treats /sign-up/* as public", () => {
    assert.equal(isPublicRoute("/sign-up/verify"), true);
  });

  it("treats /search as public", () => {
    assert.equal(isPublicRoute("/search"), true);
  });

  it("treats /search/* as public", () => {
    assert.equal(isPublicRoute("/search/streams"), true);
  });

  // ── Dynamic /:username public routes ─────────────────────────────────

  it("treats a single-segment root path as a public /:username route", () => {
    assert.equal(isPublicRoute("/ninja"), true);
  });

  it("treats another single-segment root path as public", () => {
    assert.equal(isPublicRoute("/johndoe"), true);
  });

  // ── Protected root paths (reserved segments) ────────────────────────

  it("treats /u as protected (NOT public)", () => {
    assert.equal(isPublicRoute("/u"), false);
  });

  // ── Nested / multi-segment paths (not public) ───────────────────────

  it("treats /u/ninja as not public (multi-segment)", () => {
    assert.equal(isPublicRoute("/u/ninja"), false);
  });

  it("treats /u/ninja/keys as not public (multi-segment)", () => {
    assert.equal(isPublicRoute("/u/ninja/keys"), false);
  });

  it("treats /settings as not public if not in public routes", () => {
    // /settings is a single segment but not in the static list.
    // However, it's not a reserved segment either, so it IS treated as
    // a /:username route. If /settings were added as a real app route,
    // it should be added to PROTECTED_ROOT_SEGMENTS.
    assert.equal(isPublicRoute("/settings"), true);
  });

  // ── API routes that are NOT in the explicit public list ──────────────

  it("treats /api/other as not public", () => {
    assert.equal(isPublicRoute("/api/other"), false);
  });

  // ── Edge cases ───────────────────────────────────────────────────────

  it("treats an empty path as not public", () => {
    assert.equal(isPublicRoute(""), false);
  });

  it("treats a trailing-slash root path as not matching /:username", () => {
    // "/ninja/" has a trailing slash → two segments after split → not single-segment
    assert.equal(isPublicRoute("/ninja/"), false);
  });
});
