import { describe, it, expect } from "vitest";
import { windctrl, dynamic as d } from "../";

describe("windctrl", () => {
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

  describe("Dynamic presets", () => {
    describe("d.px()", () => {
      it("should output inline style for number (px) and keep className empty", () => {
        const box = windctrl({
          dynamic: {
            w: d.px("width"),
          },
        });

        const result = box({ w: 123 });
        expect(result.style).toEqual({ width: "123px" });
        expect(result.className).toBe("");
      });

      it("should pass through className string for string input (Unified API)", () => {
        const box = windctrl({
          dynamic: {
            w: d.px("width"),
          },
        });

        const result = box({ w: "w-full" });
        expect(result.className).toContain("w-full");
        expect(result.style).toEqual(undefined);
      });
    });

    describe("d.num()", () => {
      it("should output inline style for number (unitless) and keep className empty", () => {
        const layer = windctrl({
          dynamic: {
            z: d.num("zIndex"),
          },
        });

        const result = layer({ z: 999 });
        expect(result.style).toEqual({ zIndex: 999 });
        expect(result.className).toBe("");
      });

      it("should pass through className string for string input (Unified API)", () => {
        const layer = windctrl({
          dynamic: {
            z: d.num("zIndex"),
          },
        });

        const result = layer({ z: "z-50" });
        expect(result.className).toContain("z-50");
        expect(result.style).toEqual(undefined);
      });
    });

    describe("d.opacity()", () => {
      it("should output inline style for number and keep className empty", () => {
        const fade = windctrl({
          dynamic: {
            opacity: d.opacity(),
          },
        });

        const result = fade({ opacity: 0.4 });
        expect(result.style).toEqual({ opacity: 0.4 });
        expect(result.className).toBe("");
      });

      it("should pass through className string for string input (Unified API)", () => {
        const fade = windctrl({
          dynamic: {
            opacity: d.opacity(),
          },
        });

        const result = fade({ opacity: "opacity-50" });
        expect(result.className).toContain("opacity-50");
        expect(result.style).toEqual(undefined);
      });
    });

    describe("d.var()", () => {
      it("should set CSS variable as inline style for number with unit (no className output)", () => {
        const card = windctrl({
          dynamic: {
            x: d.var("--x", { unit: "px" }),
          },
        });

        const result = card({ x: 12 });

        // NOTE: CSS custom properties are stored as object keys.
        expect(result.style).toEqual({ "--x": "12px" });
        expect(result.className).toBe("");
      });

      it("should set CSS variable as inline style for string value (no className output)", () => {
        const card = windctrl({
          dynamic: {
            x: d.var("--x"),
          },
        });

        const result = card({ x: "10%" });
        expect(result.style).toEqual({ "--x": "10%" });
        expect(result.className).toBe("");
      });

      it("should merge multiple CSS variables via last-one-wins when same variable is set twice", () => {
        const card = windctrl({
          dynamic: {
            x1: d.var("--x", { unit: "px" }),
            x2: d.var("--x", { unit: "px" }),
          },
        });

        const result = card({ x1: 10, x2: 20 });

        // last one wins
        expect(result.style).toEqual({ "--x": "20px" });
      });
    });

    it("should coexist with other dynamic resolvers (className + style merge)", () => {
      const box = windctrl({
        dynamic: {
          w: d.px("width"),
          opacity: d.opacity(),
          // keep an existing custom resolver in the same config
          custom: (v) => (v ? "ring-2" : ""),
        },
      });

      const result = box({ w: 100, opacity: 0.5, custom: true });

      expect(result.style).toEqual({ width: "100px", opacity: 0.5 });
      expect(result.className).toContain("ring-2");
    });
  });
});
