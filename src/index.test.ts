import { describe, it, expect } from "vitest";
import { windctrl, wc } from "./";

describe("wc", () => {
  it("should be the same as windctrl", () => {
    expect(wc).toBe(windctrl);
  });
});

describe("windctrl", () => {
  describe("Base classes", () => {
    it("should apply base classes when provided", () => {
      const button = windctrl({
        base: "rounded px-4 py-2",
      });

      const result = button();
      expect(result.className).toContain("rounded");
      expect(result.className).toContain("px-4");
      expect(result.className).toContain("py-2");
      expect(result.style).toEqual(undefined);
    });

    it("should work without base classes", () => {
      const button = windctrl({});

      const result = button({});
      expect(result.className).toBe("");
      expect(result.style).toEqual(undefined);
    });
  });

  describe("Variants", () => {
    it("should apply variant classes based on prop value", () => {
      const button = windctrl({
        base: "rounded",
        variants: {
          intent: {
            primary: "bg-blue-500 text-white",
            secondary: "bg-gray-500 text-gray-900",
          },
        },
      });

      const primaryResult = button({ intent: "primary" });
      expect(primaryResult.className).toContain("bg-blue-500");
      expect(primaryResult.className).toContain("text-white");
      expect(primaryResult.className).toContain("rounded");

      const secondaryResult = button({ intent: "secondary" });
      expect(secondaryResult.className).toContain("bg-gray-500");
      expect(secondaryResult.className).toContain("text-gray-900");
      expect(secondaryResult.className).toContain("rounded");
    });

    it("should handle multiple variant dimensions", () => {
      const button = windctrl({
        variants: {
          size: {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
          },
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500",
          },
        },
      });

      const result = button({ size: "sm", intent: "primary" });
      expect(result.className).toContain("text-sm");
      expect(result.className).toContain("bg-blue-500");
    });

    it("should not apply variant classes when prop is not provided", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500",
          },
        },
      });

      const result = button({});
      expect(result.className).not.toContain("bg-blue-500");
      expect(result.className).not.toContain("bg-gray-500");
    });
  });

  describe("Default variants", () => {
    it("should apply default variant values when prop is not provided", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500",
          },
        },
        defaultVariants: {
          intent: "primary",
        },
      });

      const result = button({});
      expect(result.className).toContain("bg-blue-500");
    });

    it("should allow overriding default variants", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500",
          },
        },
        defaultVariants: {
          intent: "primary",
        },
      });

      const result = button({ intent: "secondary" });
      expect(result.className).toContain("bg-gray-500");
      expect(result.className).not.toContain("bg-blue-500");
    });

    it("should handle multiple default variants", () => {
      const button = windctrl({
        variants: {
          size: {
            sm: "text-sm",
            md: "text-base",
          },
          intent: {
            primary: "bg-blue-500",
            secondary: "bg-gray-500",
          },
        },
        defaultVariants: {
          size: "md",
          intent: "primary",
        },
      });

      const result = button({});
      expect(result.className).toContain("text-base");
      expect(result.className).toContain("bg-blue-500");
    });
  });

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

  describe("Dynamic (Interpolated Variants)", () => {
    it("should apply className when dynamic resolver returns string", () => {
      const button = windctrl({
        dynamic: {
          w: (val) => (typeof val === "number" ? `w-[${val}px]` : `w-${val}`),
        },
      });

      const result = button({ w: "full" });
      expect(result.className).toContain("w-full");
      expect(result.style).toEqual(undefined);
    });

    it("should apply style when dynamic resolver returns object with style", () => {
      const button = windctrl({
        dynamic: {
          w: (val) =>
            typeof val === "number"
              ? { style: { width: `${val}px` } }
              : `w-${val}`,
        },
      });

      const result = button({ w: 200 });
      expect(result.style).toEqual({ width: "200px" });
    });

    it("should merge className and style when dynamic resolver returns both", () => {
      const button = windctrl({
        base: "rounded",
        dynamic: {
          color: (val) => ({
            className: `text-${val}`,
            style: { color: val },
          }),
        },
      });

      const result = button({ color: "red" });
      expect(result.className).toContain("text-red");
      expect(result.style).toEqual({ color: "red" });
    });

    it("should handle multiple dynamic props", () => {
      const button = windctrl({
        dynamic: {
          w: (val) =>
            typeof val === "number"
              ? { style: { width: `${val}px` } }
              : `w-${val}`,
          h: (val) =>
            typeof val === "number"
              ? { style: { height: `${val}px` } }
              : `h-${val}`,
        },
      });

      const result = button({ w: 100, h: 200 });
      expect(result.style).toEqual({ width: "100px", height: "200px" });
    });

    it("should handle mixed dynamic props (string and number)", () => {
      const button = windctrl({
        dynamic: {
          w: (val) =>
            typeof val === "number"
              ? { style: { width: `${val}px` } }
              : `w-${val}`,
        },
      });

      const stringResult = button({ w: "full" });
      expect(stringResult.className).toContain("w-full");
      expect(stringResult.style).toEqual(undefined);

      const numberResult = button({ w: 300 });
      expect(numberResult.style).toEqual({ width: "300px" });
    });

    it("should resolve style conflicts with last one wins for dynamic styles", () => {
      const box = windctrl({
        dynamic: {
          w1: () => ({ style: { width: "100px" } }),
          w2: () => ({ style: { width: "200px" } }),
        },
      });

      const result = box({ w1: true as any, w2: true as any });

      expect(result.style).toEqual({ width: "200px" });
    });
  });

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
