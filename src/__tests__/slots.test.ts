import { describe, it, expect } from "vitest";
import { windctrl } from "../";

describe("windctrl", () => {
  describe("Slots", () => {
    it("should return slots as class strings and keep root as className/style", () => {
      const button = windctrl({
        base: {
          root: "rounded",
          slots: {
            icon: "shrink-0",
            label: "truncate",
          },
        },
      });

      const result = button();

      // root stays on className/style
      expect(result.className).toContain("rounded");
      expect(result.style).toEqual(undefined);

      // slots exist as strings
      expect(result.slots?.icon).toContain("shrink-0");
      expect(result.slots?.label).toContain("truncate");
    });

    it("should apply variant slot classes based on prop value (and keep root variants working)", () => {
      const button = windctrl({
        base: {
          root: "inline-flex",
          slots: { icon: "shrink-0" },
        },
        variants: {
          size: {
            sm: {
              root: "h-8",
              slots: { icon: "h-3 w-3" },
            },
            md: {
              root: "h-10",
              slots: { icon: "h-4 w-4" },
            },
          },
        },
        defaultVariants: { size: "md" },
      });

      const sm = button({ size: "sm" });
      expect(sm.className).toContain("inline-flex");
      expect(sm.className).toContain("h-8");
      expect(sm.slots?.icon).toContain("h-3");
      expect(sm.slots?.icon).toContain("w-3");

      const fallback = button({});
      expect(fallback.className).toContain("h-10");
      expect(fallback.slots?.icon).toContain("h-4");
      expect(fallback.slots?.icon).toContain("w-4");
    });

    it("should apply trait slot classes (array form) and merge with base/variants", () => {
      const button = windctrl({
        base: {
          root: "inline-flex",
          slots: { icon: "shrink-0" },
        },
        variants: {
          size: {
            sm: { slots: { icon: "h-3 w-3" } },
          },
        },
        traits: {
          loading: {
            root: "opacity-70",
            slots: { icon: "animate-spin" },
          },
        },
      });

      const result = button({ size: "sm", traits: ["loading"] });

      // root gets trait too
      expect(result.className).toContain("opacity-70");

      // icon gets base + variant + trait
      expect(result.slots?.icon).toContain("shrink-0");
      expect(result.slots?.icon).toContain("h-3");
      expect(result.slots?.icon).toContain("w-3");
      expect(result.slots?.icon).toContain("animate-spin");
    });

    it("should let Traits override Variants on slots when Tailwind classes conflict (via twMerge)", () => {
      const button = windctrl({
        variants: {
          intent: {
            primary: { slots: { icon: "text-blue-500" } },
          },
        },
        traits: {
          dangerIcon: { slots: { icon: "text-red-500" } },
        },
      });

      const result = button({ intent: "primary", traits: ["dangerIcon"] });

      // last one wins: Traits > Variants
      expect(result.slots?.icon).toContain("text-red-500");
      expect(result.slots?.icon).not.toContain("text-blue-500");
    });

    it("should ignore invalid trait keys for slots gracefully (same behavior as root traits)", () => {
      const button = windctrl({
        traits: {
          loading: { slots: { icon: "animate-spin" } },
        },
      });

      const result = button({ traits: ["invalid-trait" as any] });

      expect(result.slots?.icon).toBe(undefined);
    });

    it("should not include slots when slots are not configured", () => {
      const button = windctrl({
        base: "rounded",
        variants: {
          size: {
            sm: "text-sm",
          },
        },
        traits: {
          loading: "opacity-50",
        },
      });

      const result = button({ size: "sm", traits: ["loading"] });

      expect(result.className).toContain("rounded");
      expect(result.className).toContain("text-sm");
      expect(result.className).toContain("opacity-50");
      expect((result as any).slots).toBe(undefined);
    });
  });
});
