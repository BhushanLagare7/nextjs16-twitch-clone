import assert from "node:assert";
import { test } from "node:test";

import { normalizeConnectionString } from "./db";

test("normalizeConnectionString rewrites sslmode=require to sslmode=verify-full when uselibpqcompat is absent", () => {
  const input = "postgresql://user:pass@localhost:5432/mydb?sslmode=require";
  const expected = "postgresql://user:pass@localhost:5432/mydb?sslmode=verify-full";
  assert.strictEqual(normalizeConnectionString(input), expected);
});

test("normalizeConnectionString leaves sslmode=require untouched when uselibpqcompat is true", () => {
  const input = "postgresql://user:pass@localhost:5432/mydb?sslmode=require&uselibpqcompat=true";
  assert.strictEqual(normalizeConnectionString(input), input);
});

test("normalizeConnectionString rewrites sslmode=require when uselibpqcompat is false", () => {
  const input = "postgresql://user:pass@localhost:5432/mydb?sslmode=require&uselibpqcompat=false";
  const result = normalizeConnectionString(input);
  const url = new URL(result);
  assert.strictEqual(url.searchParams.get("sslmode"), "verify-full");
  assert.strictEqual(url.searchParams.get("uselibpqcompat"), "false");
});

test("normalizeConnectionString preserves unrelated parameters and handles encoded values", () => {
  const input = "postgresql://user:pass@localhost:5432/mydb?sslmode=require&foo=bar%26baz&num=123";
  const result = normalizeConnectionString(input);
  const url = new URL(result);
  assert.strictEqual(url.searchParams.get("sslmode"), "verify-full");
  assert.strictEqual(url.searchParams.get("foo"), "bar&baz");
  assert.strictEqual(url.searchParams.get("num"), "123");
});

test("normalizeConnectionString handles duplicate parameters correctly", () => {
  const input = "postgresql://user:pass@localhost:5432/mydb?sslmode=require&sslmode=require&other=1";
  const result = normalizeConnectionString(input);
  const url = new URL(result);
  assert.strictEqual(url.searchParams.get("sslmode"), "verify-full");
  assert.strictEqual(url.searchParams.getAll("sslmode").length, 1);
});

test("normalizeConnectionString ignores embedded text containing sslmode=require in username/password or param values", () => {
  const input = "postgresql://sslmode=require:secret@localhost:5432/mydb?query=sslmode=require";
  assert.strictEqual(normalizeConnectionString(input), input);
});

test("normalizeConnectionString does not rewrite when sslmode is not exactly 'require'", () => {
  const input1 = "postgresql://user:pass@localhost:5432/mydb?sslmode=prefer";
  assert.strictEqual(normalizeConnectionString(input1), input1);

  const input2 = "postgresql://user:pass@localhost:5432/mydb?sslmode=required";
  assert.strictEqual(normalizeConnectionString(input2), input2);
});
