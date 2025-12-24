import { describe, it, expect } from "vitest";
import { windctrl } from "../";

describe("windctrl", () => {
  describe("Traits", () => {
    it("should apply trait classes when provided as array", () => {
      const button = windctrl({
        base: "rounded",
        traits: {
          loading: "opacity-50 cursor-wait",
          glass: "backdrop-blur bg-white/10",
        },
      });

      const result = button({ traits: ["loading", "glass"] });
      expect(result.className).toContain("opacity-50");
      expect(result.className).toContain("cursor-wait");
      expect(result.className).toContain("backdrop-blur");
      expect(result.className).toContain("bg-white/10");
      expect(result.className).toContain("rounded");
    });

    it("should apply trait classes when provided as object", () => {
      const button = windctrl({
        traits: {
          loading: "opacity-50",
          glass: "backdrop-blur",
          disabled: "pointer-events-none",
        },
      });

      const result = button({
        traits: { loading: true, glass: true, disabled: false },
      });
      expect(result.className).toContain("opacity-50");
      expect(result.className).toContain("backdrop-blur");
      expect(result.className).not.toContain("pointer-events-none");
    });

    it("should handle empty traits array", () => {
      const button = windctrl({
        base: "rounded",
        traits: {
          loading: "opacity-50",
        },
      });

      const result = button({ traits: [] });
      expect(result.className).toContain("rounded");
      expect(result.className).not.toContain("opacity-50");
    });

    it("should handle empty traits object", () => {
      const button = windctrl({
        base: "rounded",
        traits: {
          loading: "opacity-50",
        },
      });

      const result = button({ traits: {} });
      expect(result.className).toContain("rounded");
      expect(result.className).not.toContain("opacity-50");
    });

    it("should apply multiple traits orthogonally", () => {
      const button = windctrl({
        traits: {
          loading: "opacity-50",
          glass: "backdrop-blur",
          error: "border-red-500",
        },
      });

      const result = button({
        traits: ["loading", "glass", "error"],
      });
      expect(result.className).toContain("opacity-50");
      expect(result.className).toContain("backdrop-blur");
      expect(result.className).toContain("border-red-500");
    });
  });
});
