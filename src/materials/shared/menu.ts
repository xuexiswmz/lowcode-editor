import { useEffect, useMemo } from "react";
import { useComponentsStore } from "../../stores/components";

export type MenuMode = "inline" | "vertical" | "horizontal";
export type MenuTheme = "light" | "dark";

export interface MenuItemConfig {
  key: string;
  label: string;
  disabled?: boolean;
  children?: MenuItemConfig[];
}

export function normalizeMenuItems(value: unknown): MenuItemConfig[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeMenuItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is MenuItemConfig =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => {
      const children = normalizeMenuItems(item.children);

      return {
        key: String(item.key ?? ""),
        label: String(item.label ?? ""),
        disabled: Boolean(item.disabled),
        children: children.length > 0 ? children : undefined,
      };
    })
    .filter((item) => item.key.trim() && item.label.trim());
}

export function flattenMenuSelectableItems(
  items: MenuItemConfig[],
  parentLabels: string[] = [],
): { label: string; value: string }[] {
  return items.flatMap((item) => {
    const nextLabels = [...parentLabels, item.label];

    if (Array.isArray(item.children) && item.children.length > 0) {
      return flattenMenuSelectableItems(item.children, nextLabels);
    }

    return [
      {
        label: `${nextLabels.join(" / ")} (${item.key})`,
        value: item.key,
      },
    ];
  });
}

export function normalizeMenuSelectedKeys(
  value: unknown,
  items: MenuItemConfig[],
): string[] {
  const selectableKeys = new Set(
    flattenMenuSelectableItems(items).map((item) => item.value),
  );

  const normalizedValue = Array.isArray(value)
    ? value
    : value == null
      ? []
      : [value];

  return normalizedValue
    .map((item) => String(item))
    .filter((item) => selectableKeys.has(item));
}

export function normalizeMenuMode(mode: unknown): MenuMode {
  return mode === "horizontal" || mode === "vertical" ? mode : "inline";
}

export function normalizeMenuTheme(theme: unknown): MenuTheme {
  return theme === "dark" ? "dark" : "light";
}

function areStringArraysEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  );
}

export function useManagedMenuSelection(
  id: number,
  selectedKeys: unknown,
  items: MenuItemConfig[],
) {
  const { updateComponentProps } = useComponentsStore();
  const normalizedSelectedKeys = useMemo(
    () => normalizeMenuSelectedKeys(selectedKeys, items),
    [items, selectedKeys],
  );

  useEffect(() => {
    const rawSelectedKeys = Array.isArray(selectedKeys)
      ? selectedKeys.map((item) => String(item))
      : selectedKeys == null
        ? []
        : [String(selectedKeys)];

    if (!areStringArraysEqual(rawSelectedKeys, normalizedSelectedKeys)) {
      updateComponentProps(id, { selectedKeys: normalizedSelectedKeys });
    }
  }, [id, normalizedSelectedKeys, selectedKeys, updateComponentProps]);

  function updateSelectedKeys(nextSelectedKeys: string[]) {
    updateComponentProps(id, { selectedKeys: nextSelectedKeys });
  }

  return {
    selectedKeys: normalizedSelectedKeys,
    updateSelectedKeys,
  };
}
