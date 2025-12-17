# WindCtrl

> Next-generation styling library for Tailwind CSS

WindCtrl is a powerful styling library that evolves the concept of Variant APIs (like CVA) by introducing **Traits** for composable states and **Interpolated Variants** for dynamic values, all while maintaining a zero-runtime-dependency philosophy for style injection.

## Features

- 🎨 **Unified API** - Hides the distinction between static Tailwind classes and dynamic inline styles
- 🧩 **Trait System** - Solves combinatorial explosion by treating states as stackable, non-exclusive layers
- 🎯 **Scoped Styling** - Context-aware styling without React Context (RSC friendly)
- 🔒 **Type-Safe** - Full TypeScript support with intelligent type inference
- 📦 **Zero Runtime** - Minimal bundle size with only `clsx` and `tailwind-merge` as dependencies
- ⚡ **Performance** - Optimized for render performance

## Quick Start

```typescript
import { windCtrl } from "windctrl";

const button = windCtrl({
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
});

// Usage
const { className, style } = button({
  intent: "primary",
  size: "lg",
  traits: ["loading", "glass"],
  w: 200,
});
```

## Core Concepts

### Dynamic Props (Interpolated Variants)

Dynamic props allow you to pass arbitrary values that can resolve to either Tailwind classes or inline styles, bridging the gap between static classes and dynamic styles.

```typescript
const button = windCtrl({
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

// Usage
button({ w: "full" }); // Returns className: "w-full"
button({ w: 200 }); // Returns style: { width: "200px" }
button({ w: 200, h: 100 }); // Returns both className and style
```

### Traits

Traits are stackable, non-exclusive states. Unlike variants, multiple traits can be active simultaneously, solving the combinatorial explosion problem of `compoundVariants`.

```typescript
const button = windCtrl({
  traits: {
    loading: "opacity-50 cursor-wait",
    glass: "backdrop-blur bg-white/10",
    disabled: "pointer-events-none",
  },
});

// Usage - Array form
button({ traits: ["loading", "glass"] });

// Usage - Object form
button({ traits: { loading: true, glass: true, disabled: false } });
```

### Scopes

Scopes provide context-aware styling without React Context, making it fully compatible with Server Components (RSC).

```typescript
const button = windCtrl({
  scopes: {
    header: "text-sm",
    footer: "text-xs",
  },
});

// Usage - Wrap elements with data-scope attribute
<div data-scope="header" className="group/wind-scope">
  <button className={button({}).className}>Header Button</button>
</div>
```

The scope classes are automatically prefixed with `group-data-[scope=...]/wind-scope:` to work with Tailwind's group modifier.


### Variants

Variants are mutually exclusive options. Each variant dimension can have multiple options, but only one option per dimension can be active at a time.

```typescript
const button = windCtrl({
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
});

// Usage
button({ intent: "primary", size: "lg" });
```

## License

The MIT License (MIT)

Copyright (c) 2025 Masaki Morishita
