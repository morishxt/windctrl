export type CSSProperties = Record<string, string | number>;

export type DynamicResolverResult =
  | string
  | { className?: string; style?: CSSProperties };

export type DynamicResolver<T = any> = (value: T) => DynamicResolverResult;

type PxProp =
  | "width"
  | "height"
  | "minWidth"
  | "maxWidth"
  | "minHeight"
  | "maxHeight"
  | "top"
  | "right"
  | "bottom"
  | "left";

type NumProp = "zIndex" | "flexGrow" | "flexShrink" | "order";

type VarUnit = "px" | "%" | "deg" | "ms";

function px(prop: PxProp): DynamicResolver<number | string> {
  return (value: number | string): DynamicResolverResult => {
    if (typeof value === "number") {
      return { style: { [prop]: `${value}px` } };
    }
    return value;
  };
}

function num(prop: NumProp): DynamicResolver<number | string> {
  return (value: number | string): DynamicResolverResult => {
    if (typeof value === "number") {
      return { style: { [prop]: value } };
    }
    return value;
  };
}

function opacity(): DynamicResolver<number | string> {
  return (value: number | string): DynamicResolverResult => {
    if (typeof value === "number") {
      return { style: { opacity: value } };
    }
    return value;
  };
}

function cssVar(
  name: `--${string}`,
  options?: { unit?: VarUnit },
): DynamicResolver<number | string> {
  return (value: number | string): DynamicResolverResult => {
    if (typeof value === "number") {
      if (options?.unit) {
        return { style: { [name]: `${value}${options.unit}` } };
      }
      return { style: { [name]: String(value) } };
    }
    return { style: { [name]: value } };
  };
}

export const dynamic = {
  px,
  num,
  opacity,
  var: cssVar,
};
