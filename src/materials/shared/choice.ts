import { useEffect, useMemo } from "react";
import { useComponentsStore } from "../../stores/components";

export interface ChoiceOption {
  label: string;
  value: string;
}

export type ChoiceMode = "multiple" | undefined;
export type ChoiceModeFieldValue = "single" | "multiple";

export function normalizeChoiceOptions(value: unknown): ChoiceOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is ChoiceOption =>
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        "value" in item,
    )
    .map((item) => ({
      label: String(item.label),
      value: String(item.value),
    }))
    .filter((item) => item.value.trim());
}

export function normalizeSingleChoiceValue(
  value: unknown,
  options: ChoiceOption[],
): string | undefined {
  const normalizedValue = Array.isArray(value)
    ? String(value[0] ?? "")
    : String(value ?? "");

  return options.some((item) => item.value === normalizedValue)
    ? normalizedValue
    : undefined;
}

export function normalizeMultipleChoiceValue(
  value: unknown,
  options: ChoiceOption[],
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const optionValues = new Set(options.map((item) => item.value));

  return value
    .map((item) => String(item))
    .filter((item) => optionValues.has(item));
}

export function normalizeChoiceMode(mode: unknown): ChoiceMode {
  return mode === "multiple" ? "multiple" : undefined;
}

export function normalizeChoiceModeFieldValue(mode: unknown): ChoiceModeFieldValue {
  return normalizeChoiceMode(mode) === "multiple" ? "multiple" : "single";
}

export function normalizeChoiceValue(
  value: unknown,
  options: ChoiceOption[],
  mode?: ChoiceMode,
) {
  return mode === "multiple"
    ? normalizeMultipleChoiceValue(value, options)
    : normalizeSingleChoiceValue(value, options);
}

function areChoiceArraysEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  );
}

function areChoiceValuesEqual(
  left: string | string[] | undefined,
  right: string | string[] | undefined,
  mode?: ChoiceMode,
) {
  if (mode === "multiple") {
    return areChoiceArraysEqual(
      Array.isArray(left) ? left : [],
      Array.isArray(right) ? right : [],
    );
  }

  return (left ?? undefined) === (right ?? undefined);
}

export function useManagedChoiceValue(
  id: number,
  value: unknown,
  options: ChoiceOption[],
  mode?: ChoiceMode,
) {
  const { updateComponentProps } = useComponentsStore();
  const normalizedValue = useMemo(
    () => normalizeChoiceValue(value, options, mode),
    [mode, options, value],
  );

  useEffect(() => {
    const rawValue =
      mode === "multiple"
        ? Array.isArray(value)
          ? value.map((item) => String(item))
          : []
        : Array.isArray(value)
          ? String(value[0] ?? "")
          : value == null
            ? undefined
            : String(value);

    if (!areChoiceValuesEqual(rawValue, normalizedValue, mode)) {
      updateComponentProps(id, { value: normalizedValue });
    }
  }, [id, mode, normalizedValue, updateComponentProps, value]);

  function updateValue(nextValue: string | string[] | undefined) {
    updateComponentProps(id, { value: nextValue });
  }

  return {
    normalizedValue,
    updateValue,
  };
}
