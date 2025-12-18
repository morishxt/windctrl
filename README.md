# WindCtrl

> Advanced variant API for Tailwind CSS with stackable traits and interpolated dynamic styles.

**WindCtrl** is a next-generation styling utility that unifies static Tailwind classes and dynamic inline styles into a single, type-safe interface.

It evolves the concept of Variant APIs (like [cva](https://cva.style/)) by introducing **Stackable Traits** to solve combinatorial explosion and **Interpolated Variants** for seamless dynamic value handling—all while maintaining a minimal runtime footprint optimized for Tailwind's JIT compiler.

## Features

- 🎨 **Unified API** - Seamlessly blends static Tailwind classes and dynamic inline styles into one cohesive interface.
- 🧩 **Trait System** - Solves combinatorial explosion by treating states as stackable, non-exclusive layers.
- 🎯 **Scoped Styling** - Context-aware styling using data attributes - no React Context required (RSC friendly).
- ⚡ **JIT Optimized** - Prevents CSS bundle bloat by intelligently routing arbitrary values to inline styles.
- 🔒 **Type-Safe** - Best-in-class TypeScript support with automatic prop inference.
- 📦 **Minimal Overhead** - Ultra-lightweight runtime with only `clsx` and `tailwind-merge` as dependencies.

## Installation

```bash
npm install windctrl
```

## Quick Start

```typescript
import { windCtrl } from "windctrl";

const button = windCtrl({
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

Interpolated variants provide a **Unified API** that bridges the gap between static Tailwind classes and dynamic inline styles. You can pass arbitrary values (handled as inline styles) or utility strings (handled as static classes) through a single prop, without breaking Tailwind's JIT compilation.

```typescript
const button = windCtrl({
  dynamic: {
    // ⚡ JIT Friendly Pattern:
    // Numbers -> Inline styles (bypassing JIT)
    // Strings -> Static classes (scanned by JIT)
    w: (val) =>
      typeof val === "number" ? { style: { width: `${val}px` } } : val,
  },
});

// Usage
button({ w: "w-full" }); // -> className="w-full" (Static)
button({ w: 200 });      // -> style="width: 200px" (Dynamic)
```

### Traits (Stackable States)

Traits are non-exclusive, stackable layers of state. Unlike `variants` (which are mutually exclusive), multiple traits can be active simultaneously. This declarative approach solves the "combinatorial explosion" problem often seen with `compoundVariants`.

```typescript
const button = windCtrl({
  traits: {
    loading: "opacity-50 cursor-wait",
    glass: "backdrop-blur-md bg-white/10 border border-white/20",
    disabled: "pointer-events-none grayscale",
  },
});

// Usage - Array form (Clean & Type-safe)
button({ traits: ["loading", "glass"] });

// Usage - Object form (Great for boolean props)
button({ traits: { loading: isLoading, glass: true } });
```

### Scopes (RSC Support)

Scopes enable **context-aware styling** without relying on React Context or client-side JavaScript. This makes them fully compatible with React Server Components (RSC). They utilize Tailwind's group modifier logic under the hood.

```typescript
const button = windCtrl({
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
const button = windCtrl({
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

## License

The MIT License (MIT)

Copyright (c) 2025 Masaki Morishita
