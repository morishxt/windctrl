import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type CSSProperties = Record<string, string | number>;

type DynamicResolverResult =
  | string
  | { className?: string; style?: CSSProperties };

type DynamicResolver = (value: any) => DynamicResolverResult;

type Config<
  TVariants extends Record<string, Record<string, ClassValue>> = {},
  TTraits extends Record<string, ClassValue> = {},
  TDynamic extends Record<string, DynamicResolver> = {},
  TScopes extends Record<string, ClassValue> = {},
> = {
  base?: ClassValue;
  variants?: TVariants;
  traits?: TTraits;
  dynamic?: TDynamic;
  scopes?: TScopes;
  defaultVariants?: {
    [K in keyof TVariants]?: keyof TVariants[K] extends string
      ? keyof TVariants[K]
      : never;
  };
};

type Props<
  TVariants extends Record<string, Record<string, ClassValue>> = {},
  TTraits extends Record<string, ClassValue> = {},
  TDynamic extends Record<string, DynamicResolver> = {},
> = {
  [K in keyof TVariants]?: keyof TVariants[K] extends string
    ? keyof TVariants[K]
    : never;
} & {
  traits?:
    | Array<keyof TTraits extends string ? keyof TTraits : never>
    | Partial<
        Record<keyof TTraits extends string ? keyof TTraits : never, boolean>
      >;
} & {
  [K in keyof TDynamic]?: Parameters<TDynamic[K]>[0];
};

type Result = {
  className: string;
  style?: CSSProperties;
};

function mergeStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

function processTraits<TTraits extends Record<string, ClassValue>>(
  traits: TTraits,
  propsTraits?: Props<{}, TTraits>["traits"],
): ClassValue[] {
  if (!propsTraits) return [];

  if (Array.isArray(propsTraits)) {
    return propsTraits
      .filter((key) => key in traits)
      .map((key) => traits[key as keyof TTraits]);
  }

  if (typeof propsTraits === "object") {
    return Object.entries(propsTraits)
      .filter(([key, value]) => value && key in traits)
      .map(([key]) => traits[key as keyof TTraits]);
  }

  return [];
}

function processDynamic<TDynamic extends Record<string, DynamicResolver>>(
  dynamic: TDynamic,
  props: Props<{}, {}, TDynamic>,
): { className: ClassValue[]; style: CSSProperties } {
  const classNameParts: ClassValue[] = [];
  const styles: CSSProperties[] = [];

  for (const [key, resolver] of Object.entries(dynamic)) {
    const value = props[key as keyof TDynamic];
    if (value !== undefined && value !== null) {
      const result = resolver(value);
      if (typeof result === "string") {
        classNameParts.push(result);
      } else {
        if (result.className) {
          classNameParts.push(result.className);
        }
        if (result.style) {
          styles.push(result.style);
        }
      }
    }
  }

  return {
    className: classNameParts,
    style: mergeStyles(...styles),
  };
}

function processScopes<TScopes extends Record<string, ClassValue>>(
  scopes: TScopes,
): ClassValue[] {
  return Object.entries(scopes).map(([scopeName, scopeClasses]) => {
    const classesStr =
      typeof scopeClasses === "string" ? scopeClasses : clsx(scopeClasses);

    return classesStr
      .split(/\s+/)
      .filter(Boolean)
      .map((cls) => `group-data-[scope=${scopeName}]/wind-scope:${cls}`)
      .join(" ");
  });
}

export function windCtrl<
  TVariants extends Record<string, Record<string, ClassValue>> = {},
  TTraits extends Record<string, ClassValue> = {},
  TDynamic extends Record<string, DynamicResolver> = {},
  TScopes extends Record<string, ClassValue> = {},
>(
  config: Config<TVariants, TTraits, TDynamic, TScopes>,
): (props?: Props<TVariants, TTraits, TDynamic>) => Result {
  const {
    base,
    variants = {} as TVariants,
    traits = {} as TTraits,
    dynamic = {} as TDynamic,
    scopes = {} as TScopes,
    defaultVariants = {},
  } = config;

  const resolvedScopeClasses = processScopes(scopes);

  return (props = {} as Props<TVariants, TTraits, TDynamic>) => {
    const classNameParts: ClassValue[] = [];
    let mergedStyle: CSSProperties = {};

    // Priority order: Base < Variants < Traits < Dynamic
    // (Higher priority classes are added later, so tailwind-merge will keep them)

    // 1. Base classes (lowest priority)
    if (base) {
      classNameParts.push(base);
    }

    // 2. Variants (with defaultVariants fallback)
    if (variants) {
      for (const [variantKey, variantOptions] of Object.entries(variants)) {
        const propValue =
          props[variantKey as keyof typeof props] ??
          defaultVariants[variantKey as keyof typeof defaultVariants];
        if (propValue && variantOptions[propValue as string]) {
          classNameParts.push(variantOptions[propValue as string]);
        }
      }
    }

    // 3. Traits (higher priority than variants)
    if (traits && props.traits) {
      const traitClasses = processTraits(traits, props.traits);
      classNameParts.push(...traitClasses);
    }

    // 4. Dynamic (highest priority for className)
    if (dynamic) {
      const dynamicResult = processDynamic(dynamic, props);
      classNameParts.push(...dynamicResult.className);
      mergedStyle = mergeStyles(mergedStyle, dynamicResult.style);
    }

    // 5. Scopes (always applied, but don't conflict with other classes)
    if (resolvedScopeClasses.length) {
      classNameParts.push(...resolvedScopeClasses);
    }

    const finalClassName = twMerge(clsx(classNameParts));

    const hasStyle = Object.keys(mergedStyle).length > 0;

    return {
      className: finalClassName,
      ...(hasStyle && { style: mergedStyle }),
    };
  };
}
