import { describe, it, expect } from "vitest";
import { wcn } from "../";

describe("wcn", () => {
  it("should merge class names with clsx behavior", () => {
    expect(wcn("a", false && "b", null as any, undefined, "c")).toBe("a c");
  });

  it("should resolve Tailwind conflicts using tailwind-merge (last one wins)", () => {
    expect(wcn("p-2", "p-4")).toBe("p-4");
  });

  it("should handle arrays and objects like clsx", () => {
    expect(wcn(["a", ["b"]], { c: true, d: false })).toBe("a b c");
  });
});
