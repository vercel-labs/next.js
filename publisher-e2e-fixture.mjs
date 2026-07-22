import assert from "node:assert/strict";
import test from "node:test";

const { truncateText } = await import("../agent/lib/truncate-text.ts");

test("truncates text with an explicit marker", () => {
  assert.equal(truncateText("", 3), "");
  assert.equal(truncateText("abc", 3), "abc");
  assert.equal(truncateText("abcd", 3), "abc\n[truncated]");
});
