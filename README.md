# WindCtrl

> Advanced variant API for Tailwind CSS with stackable traits and interpolated dynamic styles.

**WindCtrl** is a next-generation styling utility that unifies static Tailwind classes and dynamic inline styles into a single, type-safe interface.

It evolves the concept of Variant APIs (like [cva](https://cva.style/)) by introducing **Stackable Traits** to solve combinatorial explosion and **Interpolated Variants** for seamless dynamic value handling—all while maintaining a minimal runtime footprint optimized for Tailwind's JIT compiler.

## Features

- 🎨 **Unified API** - Seamlessly blends static Tailwind classes and dynamic inline styles into one cohesive interface.
- 🧩 **Trait System** - Solves combinatorial explosion by treating states as stackable, non-exclusive layers.
- 🎯 **Scoped Styling** - Context-aware styling using data attributes - no React Context required (RSC friendly).
- ⚡ **JIT Conscious** - Designed for Tailwind JIT: utilities stay as class strings, while truly dynamic values can be expressed as inline styles.
- 🔒 **Type-Safe** - Best-in-class TypeScript support with automatic prop inference.
- 📦 **Minimal Overhead** - Ultra-lightweight runtime with only `clsx` and `tailwind-merge` as dependencies.

## Installation

```bash
npm install windctrl
```

## Quick Start

```typescript
import { windctrl } from "windctrl";

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
    w: (val) =>
      typeof val === "number" ? { style: { width: `${val}px` } } : val,
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

### Interpolated Variants (Dynamic Props)

Interpolated variants provide a **Unified API** that bridges static Tailwind classes and dynamic inline styles. A dynamic resolver can return either:

- a **Tailwind class string** (static utility), or
- an object containing **className and/or style** (inline styles and optional utilities)

This is **JIT-friendly by design**, as long as the class strings you return are statically enumerable (i.e. appear in your source code).
For truly unbounded values (e.g. pixel sizes), prefer returning style to avoid relying on arbitrary-value class generation.

```typescript
const button = windctrl({
  dynamic: {
    // Recommended pattern:
    // - Numbers -> inline styles (unbounded values)
    // - Strings -> Tailwind utilities (must be statically enumerable for JIT)
    w: (val) =>
      typeof val === "number" ? { style: { width: `${val}px` } } : val,
  },
});

// Usage
button({ w: "w-full" }); // -> className includes "w-full" (static utility)
button({ w: 200 }); // -> style includes { width: "200px" } (dynamic value)
```

> **Note on Tailwind JIT**: Tailwind only generates CSS for class names it can statically detect in your source. Avoid constructing class strings dynamically (e.g. "`w-`" + `size`) unless you safelist them in your Tailwind config.

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
// 1. Wrap the parent with `data-scope` and `group/wind-scope`
// 2. The button automatically adapts its style based on the parent
<div data-scope="header" className="group/wind-scope">
  <button className={button().className}>Header Button</button>
</div>
```

The scope classes are automatically prefixed with `group-data-[scope=...]/wind-scope:` to target the parent's data attribute.

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

## Gotchas

- **Tailwind JIT:** Tailwind only generates CSS for class names it can statically detect. Avoid constructing class strings dynamically unless you safelist them.
- **Traits precedence:** If trait order matters, use the array form (`traits: ["a", "b"]`) to make precedence explicit.
- **SSR/RSC:** Keep dynamic resolvers pure (same input → same output) to avoid hydration mismatches.
- **Static config:** `windctrl` configuration is treated as static/immutable. Mutating the config object after creation is not supported.

## License

The MIT License (MIT)

Copyright (c) 2025 Masaki Morishita
