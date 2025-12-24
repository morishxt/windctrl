# WindCtrl

> Advanced variant API for Tailwind CSS with stackable traits and interpolated dynamic styles.

**WindCtrl** is a next-generation styling utility that unifies static Tailwind classes and dynamic inline styles into a single, type-safe interface.

It builds on existing variant APIs (like [cva](https://cva.style/)) and introduces **Stackable Traits** to avoid combinatorial explosion, as well as **Interpolated Variants** for seamless dynamic styling.
All of this is achieved with a minimal runtime footprint and full compatibility with Tailwind's JIT compiler.

## Features

- 🧩 **Trait System** - Solves combinatorial explosion by treating states as stackable, non-exclusive layers.
- 🎨 **Unified API** - Seamlessly blends static Tailwind classes and dynamic inline styles into one cohesive interface.
- ⚡ **JIT Conscious** - Designed for Tailwind JIT: utilities stay as class strings, while truly dynamic values can be expressed as inline styles.
- 🎯 **Scoped Styling** - Context-aware styling using data attributes - no React Context required (RSC friendly).
- 🔒 **Type-Safe** - Best-in-class TypeScript support with automatic prop inference.
- 📦 **Minimal Overhead** - Ultra-lightweight runtime with only `clsx` and `tailwind-merge` as dependencies.

## Installation

```bash
npm install windctrl
```

## Quick Start

```typescript
import { windctrl, dynamic as d } from "windctrl";

const button = windctrl({
  base: "rounded px-4 py-2 font-medium transition duration-200",
  variants: {
    intent: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    },
    size: {
      sm: "text-sm h-8",
      md: "text-base h-10",
      lg: "text-lg h-12",
    },
  },
  traits: {
    loading: "opacity-70 cursor-wait pointer-events-none",
    glass: "backdrop-blur-md bg-white/10 border border-white/20 shadow-xl",
  },
  dynamic: {
    w: d.px("width"),
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

// Usage Example

// 1. Standard usage
button({ intent: "primary", size: "lg" });

// 2. Using Traits (Stackable states)
button({ traits: ["glass", "loading"] });

// 3. Unified API for dynamic values
// Pass a number for arbitrary px value (Inline Style)
button({ w: 350 });
// Pass a string for Tailwind utility (Static Class)
button({ w: "w-full" });
```

## Core Concepts

### Variants

Variants represent mutually exclusive design choices (e.g., `primary` vs `secondary`). They serve as the foundation of your component's design system.

```typescript
const button = windctrl({
  variants: {
    intent: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    },
    size: {
      sm: "text-sm h-8 px-3",
      md: "text-base h-10 px-4",
      lg: "text-lg h-12 px-6",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

// Usage
button({ intent: "primary", size: "lg" });
```

### Traits (Stackable States)

Traits are non-exclusive, stackable layers of state. Unlike `variants` (which are mutually exclusive), multiple traits can be active simultaneously. This declarative approach solves the "combinatorial explosion" problem often seen with `compoundVariants`.

Traits are **non-exclusive, stackable modifiers**. Unlike variants (mutually exclusive design choices), multiple traits can be active at the same time. This is a practical way to model boolean-like component states (e.g. `loading`, `disabled`, `glass`) without exploding compoundVariants.

When multiple traits generate conflicting utilities, Tailwind’s “last one wins” rule applies (via `tailwind-merge`).
If ordering matters, prefer the **array form** to make precedence explicit.

```typescript
const button = windctrl({
  traits: {
    loading: "opacity-50 cursor-wait",
    glass: "backdrop-blur-md bg-white/10 border border-white/20",
    disabled: "pointer-events-none grayscale",
  },
});

// Usage - Array form (explicit precedence; recommended when conflicts are possible)
button({ traits: ["loading", "glass"] });

// Usage - Object form (convenient for boolean props; order is not intended to be meaningful)
button({ traits: { loading: isLoading, glass: true } });
```

### Slots (Compound Components)

Slots allow you to define styles for **sub-elements** (e.g., icon, label) within a single component definition. Each slot returns its own class string, enabling clean compound component patterns.

Slots are completely optional and additive. You can start with a single-root component and introduce slots only when needed.
If a slot is never defined, it simply won't appear in the result.

```typescript
const button = windctrl({
  base: {
    root: "inline-flex items-center gap-2 rounded px-4 py-2",
    slots: {
      icon: "shrink-0",
      label: "truncate",
    },
  },
  variants: {
    size: {
      sm: {
        root: "h-8 text-sm",
        slots: { icon: "h-3 w-3" },
      },
      md: {
        root: "h-10 text-base",
        slots: { icon: "h-4 w-4" },
      },
    },
  },
  traits: {
    loading: {
      root: "opacity-70 pointer-events-none",
      slots: { icon: "animate-spin" },
    },
  },
  defaultVariants: { size: "md" },
});

// Usage
const { className, slots } = button({ size: "sm", traits: ["loading"] });

// Apply to elements
<button className={className}>
  <Icon className={slots?.icon} />
  <span className={slots?.label}>Click me</span>
</button>
```

Slots follow the same priority rules as root classes: **Base < Variants < Traits**, with `tailwind-merge` handling conflicts.

Unlike slot-based APIs that require declaring all slots upfront, WindCtrl allows slots to emerge naturally from variants and traits.

### Interpolated Variants (Dynamic Props)

Interpolated variants provide a **Unified API** that bridges static Tailwind classes and dynamic inline styles. A dynamic resolver can return either:

- a **Tailwind class string** (static utility), or
- an object containing **className and/or style** (inline styles and optional utilities)

This is **JIT-friendly by design**, as long as the class strings you return are statically enumerable (i.e. appear in your source code).
For truly unbounded values (e.g. pixel sizes), prefer returning style to avoid relying on arbitrary-value class generation.

#### Dynamic Presets

WindCtrl provides built-in presets for common dynamic patterns:

```typescript
import { windctrl, dynamic as d } from "windctrl";

const box = windctrl({
  dynamic: {
    // d.px() - pixel values (width, height, top, left, etc.)
    w: d.px("width"),
    h: d.px("height"),

    // d.num() - unitless numbers (zIndex, flexGrow, order, etc.)
    z: d.num("zIndex"),

    // d.opacity() - opacity values
    fade: d.opacity(),

    // d.var() - CSS custom properties
    x: d.var("--translate-x", { unit: "px" }),
  },
});

// Usage
box({ w: 200 }); // -> style: { width: "200px" }
box({ w: "w-full" }); // -> className: "w-full"
box({ z: 50 }); // -> style: { zIndex: 50 }
box({ fade: 0.5 }); // -> style: { opacity: 0.5 }
box({ x: 10 }); // -> style: { "--translate-x": "10px" }
```

#### Custom Resolvers

You can also write custom resolvers for more complex logic:

```typescript
const button = windctrl({
  dynamic: {
    // Custom resolver example
    w: (val) =>
      typeof val === "number" ? { style: { width: `${val}px` } } : val,
  },
});

// Usage
button({ w: "w-full" }); // -> className includes "w-full" (static utility)
button({ w: 200 }); // -> style includes { width: "200px" } (dynamic value)
```

> **Note on Tailwind JIT**: Tailwind only generates CSS for class names it can statically detect in your source. Avoid constructing class strings dynamically (e.g. "`w-`" + `size`) unless you safelist them in your Tailwind config.

### Scopes (RSC Support)

Scopes enable **context-aware styling** without relying on React Context or client-side JavaScript. This makes them fully compatible with React Server Components (RSC). They utilize Tailwind's group modifier logic under the hood.

```typescript
const button = windctrl({
  scopes: {
    header: "text-sm py-1",
    footer: "text-xs text-gray-500",
  },
});

// Usage
// 1. Wrap the parent with `data-windctrl-scope` and `group/windctrl-scope`
// 2. The button automatically adapts its style based on the parent
<div data-windctrl-scope="header" className="group/windctrl-scope">
  <button className={button().className}>Header Button</button>
</div>
```

The scope classes are automatically prefixed with `group-data-[windctrl-scope=...]/windctrl-scope:` to target the parent's data attribute.

## Merging External `className` Safely (`wcn()`)

WindCtrl resolves Tailwind class conflicts **inside** `windctrl()` using `tailwind-merge`.
However, in real applications you often need to merge **additional `className` values** at the component boundary.

A simple string concat can reintroduce conflicts:

```tsx
// ⚠️ Can cause subtle Tailwind conflicts (e.g. p-2 vs p-4)
className={`${result.className} ${className}`}
```

WindCtrl exports a small helper for this use case:

```tsx
import { wcn } from "windctrl";

// ✅ Conflict-safe merge
className={wcn(result.className, className)}
```

`wcn()` is equivalent to `twMerge(clsx(...))` and matches WindCtrl’s internal conflict resolution behavior.
This keeps the “last one wins” behavior consistent across both generated and user-supplied classes.

## Type Helpers (`StyleProps`)

When building reusable components, you often want to expose the exact style-related props inferred from a `windctrl()` definition.

WindCtrl exports a small type helper for this purpose:

```typescript
import type { StyleProps } from "windctrl";
```

`StyleProps<typeof styles>` extracts all variant, trait, and dynamic props from a WindCtrl instance — similar to `VariantProps` in cva.

```typescript
const button = windctrl({ ... });

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof StyleProps<typeof button>>
  & StyleProps<typeof button>;
```

This lets you:

- Avoid manually duplicating variant/trait prop definitions
- Keep component props automatically in sync with styling config
- Refactor styles without touching component typings

> `StyleProps` is optional - you can always define props manually if you prefer.

> `wcProps` is provided as an alias of `StyleProps` for convenience.

## Gotchas

- **Tailwind JIT:** Tailwind only generates CSS for class names it can statically detect. Avoid constructing class strings dynamically unless you safelist them.
- **Traits precedence:** If trait order matters, use the array form (`traits: ["a", "b"]`) to make precedence explicit.
- **SSR/RSC:** Keep dynamic resolvers pure (same input → same output) to avoid hydration mismatches.
- **Static config:** `windctrl` configuration is treated as static/immutable. Mutating the config object after creation is not supported.

## License

The MIT License (MIT)

Copyright (c) 2025 Masaki Morishita
