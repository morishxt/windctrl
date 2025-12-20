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

## Documents

🚧 **Coming Soon**

Explore the API interactively. I have prepared a **context-aware ChatGPT session** to act as your coding companion. It understands the full WindCtrl API and can generate production-ready code for your specific use cases.

👉 [**Open Interactive Guide in ChatGPT**](<https://chatgpt.com/?q=Please%20explain%20how%20to%20use%20WindCtrl%20and%20compare%20it%20with%20cva%20and%20Tailwind%20Variants%20based%20on%20the%20source%20code%20in%20the%20README%20below.%0A%0A---%0A%0AREADME%3A%0A%0A%23%20WindCtrl%0A%0A%3E%20Advanced%20variant%20API%20for%20Tailwind%20CSS%20with%20stackable%20traits%20and%20interpolated%20dynamic%20styles.%0A%0A%2A%2AWindCtrl%2A%2A%20is%20a%20next-generation%20styling%20utility%20that%20unifies%20static%20Tailwind%20classes%20and%20dynamic%20inline%20styles%20into%20a%20single%2C%20type-safe%20interface.%0A%0AIt%20evolves%20the%20concept%20of%20Variant%20APIs%20(like%20%5Bcva%5D(https%3A%2F%2Fcva.style%2F))%20by%20introducing%20%2A%2AStackable%20Traits%2A%2A%20to%20solve%20combinatorial%20explosion%20and%20%2A%2AInterpolated%20Variants%2A%2A%20for%20seamless%20dynamic%20value%20handling%E2%80%94all%20while%20maintaining%20a%20minimal%20runtime%20footprint%20optimized%20for%20Tailwind%27s%20JIT%20compiler.%0A%0A%23%23%20Features%0A%0A-%20%F0%9F%8E%A8%20%2A%2AUnified%20API%2A%2A%20-%20Seamlessly%20blends%20static%20Tailwind%20classes%20and%20dynamic%20inline%20styles%20into%20one%20cohesive%20interface.%0A-%20%F0%9F%A7%A9%20%2A%2ATrait%20System%2A%2A%20-%20Solves%20combinatorial%20explosion%20by%20treating%20states%20as%20stackable%2C%20non-exclusive%20layers.%0A-%20%F0%9F%8E%AF%20%2A%2AScoped%20Styling%2A%2A%20-%20Context-aware%20styling%20using%20data%20attributes%20-%20no%20React%20Context%20required%20(RSC%20friendly).%0A-%20%E2%9A%A1%20%2A%2AJIT%20Optimized%2A%2A%20-%20Prevents%20CSS%20bundle%20bloat%20by%20intelligently%20routing%20arbitrary%20values%20to%20inline%20styles.%0A-%20%F0%9F%94%92%20%2A%2AType-Safe%2A%2A%20-%20Best-in-class%20TypeScript%20support%20with%20automatic%20prop%20inference.%0A-%20%F0%9F%93%A6%20%2A%2AMinimal%20Overhead%2A%2A%20-%20Ultra-lightweight%20runtime%20with%20only%20%60clsx%60%20and%20%60tailwind-merge%60%20as%20dependencies.%0A%0A%23%23%20Installation%0A%0A%60%60%60bash%0Anpm%20install%20windctrl%0A%60%60%60%0A%0A%23%23%20Quick%20Start%0A%0A%60%60%60typescript%0Aimport%20%7B%20windctrl%20%7D%20from%20%22windctrl%22%3B%0A%0Aconst%20button%20%3D%20windctrl(%7B%0A%20%20base%3A%20%22rounded%20px-4%20py-2%20font-medium%20transition%20duration-200%22%2C%0A%20%20variants%3A%20%7B%0A%20%20%20%20intent%3A%20%7B%0A%20%20%20%20%20%20primary%3A%20%22bg-blue-500%20text-white%20hover%3Abg-blue-600%22%2C%0A%20%20%20%20%20%20secondary%3A%20%22bg-gray-200%20text-gray-900%20hover%3Abg-gray-300%22%2C%0A%20%20%20%20%7D%2C%0A%20%20%20%20size%3A%20%7B%0A%20%20%20%20%20%20sm%3A%20%22text-sm%20h-8%22%2C%0A%20%20%20%20%20%20md%3A%20%22text-base%20h-10%22%2C%0A%20%20%20%20%20%20lg%3A%20%22text-lg%20h-12%22%2C%0A%20%20%20%20%7D%2C%0A%20%20%7D%2C%0A%20%20traits%3A%20%7B%0A%20%20%20%20loading%3A%20%22opacity-70%20cursor-wait%20pointer-events-none%22%2C%0A%20%20%20%20glass%3A%20%22backdrop-blur-md%20bg-white%2F10%20border%20border-white%2F20%20shadow-xl%22%2C%0A%20%20%7D%2C%0A%20%20dynamic%3A%20%7B%0A%20%20%20%20w%3A%20(val)%20%3D%3E%0A%20%20%20%20%20%20typeof%20val%20%3D%3D%3D%20%22number%22%20%3F%20%7B%20style%3A%20%7B%20width%3A%20%60%24%7Bval%7Dpx%60%20%7D%20%7D%20%3A%20val%2C%0A%20%20%7D%2C%0A%20%20defaultVariants%3A%20%7B%0A%20%20%20%20intent%3A%20%22primary%22%2C%0A%20%20%20%20size%3A%20%22md%22%2C%0A%20%20%7D%2C%0A%7D)%3B%0A%0A%2F%2F%20Usage%20Example%0A%0A%2F%2F%201.%20Standard%20usage%0Abutton(%7B%20intent%3A%20%22primary%22%2C%20size%3A%20%22lg%22%20%7D)%3B%0A%0A%2F%2F%202.%20Using%20Traits%20(Stackable%20states)%0Abutton(%7B%20traits%3A%20%5B%22glass%22%2C%20%22loading%22%5D%20%7D)%3B%0A%0A%2F%2F%203.%20Unified%20API%20for%20dynamic%20values%0A%2F%2F%20Pass%20a%20number%20for%20arbitrary%20px%20value%20(Inline%20Style)%0Abutton(%7B%20w%3A%20350%20%7D)%3B%0A%2F%2F%20Pass%20a%20string%20for%20Tailwind%20utility%20(Static%20Class)%0Abutton(%7B%20w%3A%20%22w-full%22%20%7D)%3B%0A%60%>)

> **Note:** The entire source code is just ~200 lines - small enough to fit entirely in your AI's context window for perfect understanding! :D

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
