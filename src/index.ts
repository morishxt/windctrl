import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties, DynamicResolver } from "./dynamic";

export { dynamic, type CSSProperties, type DynamicResolver } from "./dynamic";

type SlotAwareObject = {
  root?: ClassValue;
  slots?: Record<string, ClassValue>;
};
type SlotAwareValue = ClassValue | SlotAwareObject;

type Config<
  TVariants extends Record<string, Record<string, SlotAwareValue>> = {},
  TTraits extends Record<string, SlotAwareValue> = {},
  TDynamic extends Record<string, DynamicResolver> = {},
  TScopes extends Record<string, ClassValue> = {},
> = {
  base?: SlotAwareValue;
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
  TVariants extends Record<string, Record<string, SlotAwareValue>> = {},
  TTraits extends Record<string, SlotAwareValue> = {},
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

type SlotsOfValue<V> = V extends { slots?: infer S }
  ? S extends Record<string, any>
    ? keyof S
    : never
  : never;

type VariantOptionValues<T> =
  T extends Record<string, Record<string, infer V>> ? V : never;

type TraitValues<T> = T extends Record<string, infer V> ? V : never;

type SlotKeys<
  TBase,
  TVariants extends Record<string, Record<string, any>>,
  TTraits extends Record<string, any>,
> = Extract<
  | SlotsOfValue<TBase>
  | SlotsOfValue<VariantOptionValues<TVariants>>
  | SlotsOfValue<TraitValues<TTraits>>,
  string
>;

type Result<TSlotKeys extends string = never> = {
  className: string;
  style?: CSSProperties;
  slots?: Partial<Record<TSlotKeys, string>>;
};

function mergeStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

function isSlotAwareValue(value: unknown): value is SlotAwareObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  const hasRoot = "root" in obj;
  const hasSlots =
    "slots" in obj && typeof obj.slots === "object" && obj.slots !== null;
  return hasRoot || hasSlots;
}

function addSlotClasses(
  slotParts: Record<string, ClassValue[] | undefined>,
  slots: Record<string, ClassValue>,
): void {
  for (const [slotName, slotClasses] of Object.entries(slots)) {
    if (!slotParts[slotName]) {
      slotParts[slotName] = [];
    }
    slotParts[slotName].push(slotClasses);
  }
}

function processTraits<TTraits extends Record<string, SlotAwareValue>>(
  traits: TTraits,
  propsTraits?: Props<{}, TTraits>["traits"],
  slotParts?: Record<string, ClassValue[] | undefined>,
): ClassValue[] {
  if (!propsTraits) return [];

  const rootClasses: ClassValue[] = [];

  const processTraitKey = (key: string) => {
    if (!(key in traits)) return;
    const traitValue = traits[key as keyof TTraits];
    if (isSlotAwareValue(traitValue)) {
      if (traitValue.root) {
        rootClasses.push(traitValue.root);
      }
      if (traitValue.slots && slotParts) {
        addSlotClasses(slotParts, traitValue.slots);
      }
    } else {
      rootClasses.push(traitValue);
    }
  };

  if (Array.isArray(propsTraits)) {
    for (const key of propsTraits) {
      processTraitKey(key);
    }
  } else if (typeof propsTraits === "object") {
    for (const [key, value] of Object.entries(propsTraits)) {
      if (value) {
        processTraitKey(key);
      }
    }
  }

  return rootClasses;
}

function processDynamicEntries(
  entries: [string, DynamicResolver][],
  props: Record<string, any>,
): { className: ClassValue[]; style: CSSProperties } {
  const classNameParts: ClassValue[] = [];
  const styles: CSSProperties[] = [];

  for (const [key, resolver] of entries) {
    const value = props[key];
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
      .map(
        (cls) =>
          `group-data-[windctrl-scope=${scopeName}]/windctrl-scope:${cls}`,
      )
      .join(" ");
  });
}

export function windctrl<
  TVariants extends Record<string, Record<string, SlotAwareValue>> = {},
  TTraits extends Record<string, SlotAwareValue> = {},
  TDynamic extends Record<string, DynamicResolver> = {},
  TScopes extends Record<string, ClassValue> = {},
>(
  config: Config<TVariants, TTraits, TDynamic, TScopes>,
): (
  props?: Props<TVariants, TTraits, TDynamic>,
) => Result<SlotKeys<typeof config.base, TVariants, TTraits>> {
  type TSlotKeys = SlotKeys<typeof config.base, TVariants, TTraits>;

  const {
    base,
    variants = {} as TVariants,
    traits = {} as TTraits,
    dynamic = {} as TDynamic,
    scopes = {} as TScopes,
    defaultVariants = {},
  } = config;

  const resolvedVariants = Object.entries(variants) as [
    string,
    Record<string, SlotAwareValue>,
  ][];
  const resolvedDynamicEntries = Object.entries(dynamic) as [
    string,
    DynamicResolver,
  ][];
  const resolvedScopeClasses = processScopes(scopes);

  return (props = {} as Props<TVariants, TTraits, TDynamic>) => {
    const classNameParts: ClassValue[] = [];
    let mergedStyle: CSSProperties = {};
    const slotParts: Partial<Record<TSlotKeys, ClassValue[]>> = {};

    // Priority order: Base < Variants < Traits < Dynamic
    // (Higher priority classes are added later, so tailwind-merge will keep them)

    // 1. Base classes (lowest priority)
    if (base) {
      if (isSlotAwareValue(base)) {
        if (base.root) {
          classNameParts.push(base.root);
        }
        if (base.slots) {
          addSlotClasses(slotParts, base.slots);
        }
      } else {
        classNameParts.push(base);
      }
    }

    // 2. Variants (with defaultVariants fallback)
    for (const [variantKey, variantOptions] of resolvedVariants) {
      const propValue =
        props[variantKey as keyof typeof props] ??
        defaultVariants[variantKey as keyof typeof defaultVariants];
      if (propValue && variantOptions[propValue as string]) {
        const optionValue = variantOptions[propValue as string];
        if (isSlotAwareValue(optionValue)) {
          if (optionValue.root) {
            classNameParts.push(optionValue.root);
          }
          if (optionValue.slots) {
            addSlotClasses(slotParts, optionValue.slots);
          }
        } else {
          classNameParts.push(optionValue);
        }
      }
    }

    // 3. Traits (higher priority than variants)
    if (props.traits) {
      classNameParts.push(...processTraits(traits, props.traits, slotParts));
    }

    // 4. Dynamic (highest priority for className)
    if (resolvedDynamicEntries.length) {
      const dynamicResult = processDynamicEntries(
        resolvedDynamicEntries,
        props,
      );
      classNameParts.push(...dynamicResult.className);
      mergedStyle = mergeStyles(mergedStyle, dynamicResult.style);
    }

    // 5. Scopes (always applied, but don't conflict with other classes)
    if (resolvedScopeClasses.length) {
      classNameParts.push(...resolvedScopeClasses);
    }

    const finalClassName = twMerge(clsx(classNameParts));

    const hasStyle = Object.keys(mergedStyle).length > 0;

    let finalSlots: Partial<Record<TSlotKeys, string>> | undefined;

    const slotNames = Object.keys(slotParts) as TSlotKeys[];
    if (slotNames.length > 0) {
      const out: Partial<Record<TSlotKeys, string>> = {};

      for (const slotName of slotNames) {
        const parts = slotParts[slotName];
        if (!parts) continue;

        const merged = twMerge(clsx(parts));
        if (merged) {
          out[slotName] = merged;
        }
      }

      if (Object.keys(out).length > 0) {
        finalSlots = out;
      }
    }

    return {
      className: finalClassName,
      ...(hasStyle && { style: mergedStyle }),
      ...(finalSlots && { slots: finalSlots }),
    };
  };
}

export const wc = windctrl;

export function wcn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extract the props type from a windctrl instance
export type StyleProps<T> = T extends (props?: infer P) => any ? P : never;
export type wcProps<T> = StyleProps<T>;
