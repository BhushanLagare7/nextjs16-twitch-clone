import assert from "node:assert";
import { test } from "node:test";

import { stringToColor } from "./utils";

test("stringToColor returns deterministic hex color for identical inputs", () => {
  const color1 = stringToColor("Alice");
  const color2 = stringToColor("Alice");
  assert.strictEqual(color1, color2);
  assert.strictEqual(color1, "#BE123C");
});

test("stringToColor returns valid hex color format", () => {
  const color = stringToColor("Bob");
  assert.match(color, /^#[0-9A-Fa-f]{6}$/);
});

test("stringToColor handles empty string gracefully", () => {
  const color = stringToColor("");
  assert.match(color, /^#[0-9A-Fa-f]{6}$/);
});
