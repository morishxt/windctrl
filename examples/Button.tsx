import React from "react";
import { windctrl, dynamic as d } from "../src/index";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const button = windctrl({
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    intent: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-500 text-gray-900 hover:bg-gray-600",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
      ghost: "hover:bg-gray-100",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
    },
  },
  traits: {
    loading: "opacity-50 cursor-wait",
    glass: "backdrop-blur bg-white/10 border border-white/20",
    disabled: "pointer-events-none opacity-50",
  },
  dynamic: {
    w: d.px("width"),
    h: d.px("height"),
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
  scopes: {
    header: "text-sm",
    footer: "text-xs",
  },
});

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  intent?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  traits?:
    | Array<"loading" | "glass" | "disabled">
    | { loading?: boolean; glass?: boolean; disabled?: boolean };
  w?: string | number;
  h?: string | number;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = "button">({
  as,
  intent,
  size,
  traits,
  w,
  h,
  className,
  style,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";
  const { className: buttonClassName, style: buttonStyle } = button({
    intent,
    size,
    traits,
    w,
    h,
  });

  return (
    <Component
      className={`${buttonClassName} ${className || ""}`}
      style={{ ...buttonStyle, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}
