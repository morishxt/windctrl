import { describe, it, expect } from "vitest";
import { windctrl } from "../";

describe("windctrl", () => {
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
});
