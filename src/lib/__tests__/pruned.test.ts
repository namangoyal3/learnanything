import { describe, it, expect } from "vitest";
import { isNoindexed, noindexedPaths } from "../pruned";

describe("pruned", () => {
  it("matches noindexed paths with or without a trailing slash and never the core routes", () => {
    const sample = noindexedPaths[0];
    expect(noindexedPaths.length).toBeGreaterThan(0);
    expect(isNoindexed(sample)).toBe(true);
    expect(isNoindexed(sample + "/")).toBe(true);
    for (const core of ["/", "/pricing", "/learn", "/signup", "/interview-prep", "/product-manager-salary-india"]) {
      expect(isNoindexed(core)).toBe(false);
    }
  });
});
