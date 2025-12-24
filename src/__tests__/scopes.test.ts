import { describe, it, expect } from "vitest";
import { windctrl } from "../";

describe("windctrl", () => {
  describe("Scopes", () => {
    it("should apply scope classes with group-data selector", () => {
      const button = windctrl({
        base: "rounded",
        scopes: {
          header: "text-sm",
          footer: "text-xs",
        },
      });

      const result = button({});
      expect(result.className).toContain(
        "group-data-[windctrl-scope=header]/windctrl-scope:text-sm",
      );
      expect(result.className).toContain(
        "group-data-[windctrl-scope=footer]/windctrl-scope:text-xs",
      );
    });

    it("should combine scopes with base classes", () => {
      const button = windctrl({
        base: "px-4 py-2",
        scopes: {
          header: "text-sm",
        },
      });

      const result = button({});
      expect(result.className).toContain("px-4");
      expect(result.className).toContain("py-2");
      expect(result.className).toContain(
        "group-data-[windctrl-scope=header]/windctrl-scope:text-sm",
      );
    });

    it("should prefix every scope class when multiple classes are provided", () => {
      const button = windctrl({
        scopes: {
          header: "text-sm py-1",
        },
      });

      const result = button({});

      expect(result.className).toContain(
        "group-data-[windctrl-scope=header]/windctrl-scope:text-sm",
      );
      expect(result.className).toContain(
        "group-data-[windctrl-scope=header]/windctrl-scope:py-1",
      );
    });
  });
});
