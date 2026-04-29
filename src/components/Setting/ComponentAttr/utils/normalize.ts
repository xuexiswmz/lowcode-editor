import { normalizeChoiceOptions } from "../../../../materials/shared/choice";
import { normalizeMenuItems } from "../../../../materials/shared/menu";
import type {
  BreadcrumbItem,
  DescriptionItem,
  DropdownMenuItem,
  EditableMenuItem,
  ListDataItem,
  OptionItem,
  StepItem,
  TableActionItem,
  TableColumnItem,
  TableDataRow,
  TabsItem,
  TreeNodeItem,
} from "../types";

export const MAX_TREE_DEPTH = 6;

export function normalizeOptionItems(value: unknown): OptionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeOptionItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return normalizeChoiceOptions(value);
}

export function normalizeBreadcrumbItems(value: unknown): BreadcrumbItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeBreadcrumbItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is BreadcrumbItem =>
        typeof item === "object" && item !== null && "title" in item,
    )
    .map((item) => ({
      title: String(item.title),
      href:
        typeof item.href === "string" && item.href.trim()
          ? item.href
          : undefined,
    }))
    .filter((item) => item.title.trim());
}

export function normalizeEditableStepItems(value: unknown): StepItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableStepItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is StepItem =>
        typeof item === "object" && item !== null && "title" in item,
    )
    .map((item) => ({
      title: String(item.title ?? ""),
      description:
        typeof item.description === "string" ? item.description : undefined,
    }));
}

export function normalizeTabsItems(value: unknown): TabsItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeTabsItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TabsItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => ({
      key: String(item.key),
      label: String(item.label),
      children:
        typeof item.children === "string" && item.children.trim()
          ? item.children
          : undefined,
      disabled: Boolean(item.disabled),
    }))
    .filter((item) => item.key.trim() && item.label.trim());
}

export function normalizeDropdownMenuItems(value: unknown): DropdownMenuItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeDropdownMenuItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is DropdownMenuItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => ({
      key: String(item.key),
      label: String(item.label),
      disabled: Boolean(item.disabled),
    }))
    .filter((item) => item.key.trim() && item.label.trim());
}

export function normalizeEditableDescriptionsItems(
  value: unknown,
): DescriptionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableDescriptionsItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is DescriptionItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item &&
        "children" in item,
    )
    .map((item) => ({
      key: String(item.key ?? ""),
      label: String(item.label ?? ""),
      children: String(item.children ?? ""),
      span:
        Number.isInteger(Number(item.span)) && Number(item.span) > 0
          ? Number(item.span)
          : 1,
    }));
}

export function normalizeEditableMenuItems(value: unknown): EditableMenuItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableMenuItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is EditableMenuItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => ({
      key: String(item.key ?? ""),
      label: String(item.label ?? ""),
      disabled: Boolean(item.disabled),
      children: (() => {
        const nextChildren = normalizeEditableMenuItems(item.children);
        return nextChildren.length > 0 ? nextChildren : undefined;
      })(),
    }));
}

export function normalizeEditableListDataSource(value: unknown): ListDataItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableListDataSource(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is ListDataItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "title" in item,
    )
    .map((item) => ({
      key: String(item.key ?? ""),
      title: String(item.title ?? ""),
      description:
        typeof item.description === "string" ? item.description : undefined,
      extra: typeof item.extra === "string" ? item.extra : undefined,
    }));
}

export function normalizeEditableTableColumns(value: unknown): TableColumnItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTableColumns(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TableColumnItem =>
        typeof item === "object" &&
        item !== null &&
        ("key" in item || "title" in item || "dataIndex" in item),
    )
    .map((item, index) => {
      const key = String(item.key ?? "").trim();
      const dataIndex = String(item.dataIndex ?? "").trim();
      const widthValue = Number(item.width);

      return {
        key: key || dataIndex || `column-${index + 1}`,
        title: String(item.title ?? ""),
        dataIndex,
        width:
          Number.isFinite(widthValue) && widthValue > 0 ? widthValue : undefined,
        align:
          item.align === "center" || item.align === "right" ? item.align : "left",
        ellipsis: item.ellipsis !== false,
        renderType:
          item.renderType === "index" || item.renderType === "custom"
            ? item.renderType
            : "text",
        template: typeof item.template === "string" ? item.template : undefined,
      };
    });
}

export function normalizeEditableTableDataSource(
  value: unknown,
): TableDataRow[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTableDataSource(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is TableDataRow =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
}

export function normalizeEditableTableActions(
  value: unknown,
): TableActionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTableActions(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TableActionItem =>
        typeof item === "object" &&
        item !== null &&
        ("key" in item || "label" in item),
    )
    .map((item, index) => ({
      key: String(item.key ?? "").trim() || `action-${index + 1}`,
      label: String(item.label ?? ""),
      type: item.type === "button" ? "button" : "text",
      buttonType:
        item.buttonType === "primary" || item.buttonType === "link"
          ? item.buttonType
          : "default",
      danger: Boolean(item.danger),
      disabled: Boolean(item.disabled),
    }));
}

export function normalizeEditableTreeData(value: unknown): TreeNodeItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTreeData(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TreeNodeItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "title" in item,
    )
    .map((item) => {
      const children = normalizeEditableTreeData(item.children);

      return {
        key: String(item.key ?? ""),
        title: String(item.title ?? ""),
        disabled: Boolean(item.disabled),
        children: children.length > 0 ? children : undefined,
      };
    });
}

export function normalizeStepsCurrent(current: unknown, items: StepItem[]) {
  const numericValue = Number(current);

  if (!Number.isInteger(numericValue) || numericValue < 0) {
    return 0;
  }

  if (items.length === 0) {
    return 0;
  }

  return Math.min(numericValue, items.length - 1);
}

export function normalizeTabsActiveKey(activeKey: unknown, items: TabsItem[]) {
  const nextKey = String(activeKey ?? "");

  if (items.some((item) => item.key === nextKey)) {
    return nextKey;
  }

  return items[0]?.key;
}

export function normalizeMenuFieldValue(value: unknown) {
  return normalizeMenuItems(normalizeEditableMenuItems(value));
}
