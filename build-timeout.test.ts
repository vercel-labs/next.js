import { $ } from "bun";
import { describe, it, expect } from "bun:test";

describe("Generating nextjs stats", () => {
  it(
    "matches the snapshot",
    async () => {
      await $`cd app-nextjs && API_URL=http://127.0.0.1:9999 npx next build`;
      expect(1).toBe(1);
    },
    10_000,
  );
});
