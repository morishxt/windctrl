import { describe, it, expect } from "vitest";
import { windctrl } from "../";

describe("windctrl", () => {
  describe("Priority and Integration", () => {
    it("should apply classes in correct priority: Dynamic > Traits > Variants > Base", () => {
      const button = windctrl({
        base: "base-class",
        variants: {
          intent: {
            primary: "variant-class",
          },
        },
        traits: {
          loading: "trait-class",
        },
        dynamic: {
          w: (val) => `dynamic-class-${val}`,
        },
      });

      const result = button({
        intent: "primary",
        traits: ["loading"],
        w: "test",
      });

      expect(result.className).toContain("base-class");
      expect(result.className).toContain("variant-class");
      expect(result.className).toContain("trait-class");
      expect(result.className).toContain("dynamic-class-test");
    });

    it("should handle complex real-world scenario", () => {
      const button = windctrl({
        base: "rounded px-4 py-2 font-medium transition",
        variants: {
          intent: {
            primary: "bg-blue-500 text-white hover:bg-blue-600",
            secondary: "bg-gray-500 text-gray-900 hover:bg-gray-600",
          },
          size: {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
          },
        },
        traits: {
          loading: "opacity-50 cursor-wait",
          glass: "backdrop-blur bg-white/10",
          disabled: "pointer-events-none opacity-50",
        },
        dynamic: {
          w: (val) =>
            typeof val === "number"
              ? { style: { width: `${val}px` } }
              : `w-${val}`,
        },
        defaultVariants: {
          intent: "primary",
          size: "md",
        },
        scopes: {
          header: "text-sm",
        },
      });

      const result = button({
        intent: "secondary",
        size: "lg",
        traits: ["loading", "glass"],
        w: 200,
      });

      expect(result.className).toContain("rounded");
      expect(result.className).toContain("px-4");
      expect(result.className).toContain("py-2");

      expect(result.className).toContain("text-gray-900");
      expect(result.className).toContain("hover:bg-gray-600");
      expect(result.className).toContain("text-lg");

      expect(result.className).toContain("opacity-50");
      expect(result.className).toContain("backdrop-blur");

      expect(result.style).toEqual({ width: "200px" });

      expect(result.className).toContain(
        "group-data-[windctrl-scope=header]/windctrl-scope:text-sm",
      );
    });

    it("should merge conflicting Tailwind classes (last one wins)", () => {
      const button = windctrl({
        base: "text-red-500",
        variants: {
          intent: {
            primary: "text-blue-500",
          },
        },
      });

      const result = button({ intent: "primary" });
      expect(result.className).toContain("text-blue-500");
      expect(result.className).not.toContain("text-red-500");
    });

    it("should let Dynamic override Traits when Tailwind classes conflict (via twMerge)", () => {
      const button = windctrl({
        traits: {
          padded: "p-2",
        },
        dynamic: {
          p: (val) => (typeof val === "number" ? `p-${val}` : val),
        },
      });

      const result = button({ traits: ["padded"], p: 4 });

      expect(result.className).toContain("p-4");
      expect(result.className).not.toContain("p-2");
    });

    it("should let Traits override Base when Tailwind classes conflict (via twMerge)", () => {
      const button = windctrl({
        base: "p-1",
        traits: { padded: "p-3" },
      });

      const result = button({ traits: ["padded"] });

      expect(result.className).toContain("p-3");
      expect(result.className).not.toContain("p-1");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty configuration", () => {
      const button = windctrl({});
      const result = button({});
      expect(result.className).toBe("");
      expect(result.style).toEqual(undefined);
    });

    it("should handle undefined props gracefully", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: "bg-blue-500",
          },
        },
      });

      const result = button({ intent: undefined as any });
      expect(result.className).not.toContain("bg-blue-500");
    });

    it("should handle null props gracefully", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: "bg-blue-500",
          },
        },
      });

      const result = button({ intent: null as any });
      expect(result.className).not.toContain("bg-blue-500");
    });

    it("should handle traits with invalid keys gracefully", () => {
      const button = windctrl({
        traits: {
          loading: "opacity-50",
        },
      });

      const result = button({ traits: ["invalid-trait" as any] });
      expect(result.className).not.toContain("opacity-50");
    });
  });

  describe("Type safety", () => {
    it("should infer variant prop types correctly", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500",
          },
        },
      });

      const result1 = button({ intent: "primary" });
      expect(result1.className).toContain("bg-blue-500");

      const result2 = button({ intent: "secondary" });
      expect(result2.className).toContain("bg-gray-500");
    });

    it("should infer trait keys correctly", () => {
      const button = windctrl({
        traits: {
          loading: "opacity-50",
          glass: "backdrop-blur",
        },
      });

      const result1 = button({ traits: ["loading", "glass"] });
      expect(result1.className).toContain("opacity-50");
      expect(result1.className).toContain("backdrop-blur");

      const result2 = button({
        traits: { loading: true, glass: false },
      });
      expect(result2.className).toContain("opacity-50");
      expect(result2.className).not.toContain("backdrop-blur");
    });

    it("should infer dynamic prop types correctly", () => {
      const button = windctrl({
        dynamic: {
          w: (val) =>
            typeof val === "number"
              ? { style: { width: `${val}px` } }
              : `w-${val}`,
        },
      });

      const result1 = button({ w: "full" });
      expect(result1.className).toContain("w-full");

      const result2 = button({ w: 100 });
      expect(result2.style).toEqual({ width: "100px" });
    });
  });
});
