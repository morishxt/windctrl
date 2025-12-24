import { describe, it, expect } from "vitest";
import { windctrl, wc } from "../";

describe("wc", () => {
  it("should be the same as windctrl", () => {
    expect(wc).toBe(windctrl);
  });
});
