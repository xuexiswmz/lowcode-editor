import { forwardRef, useMemo } from "react";
import type { CommonComponentProps } from "../../interface";
import { DESCRIPTIONS_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Descriptions, materials } from "../ui";

export interface DescriptionItem {
  key: string;
  label: string;
  children: string;
  span?: number;
}

type DescriptionsSize = "default" | "middle" | "small";

type DescriptionsProps = Omit<CommonComponentProps, "children"> & {
  items?: DescriptionItem[];
  title?: string;
  column?: number;
  bordered?: boolean;
  size?: DescriptionsSize;
};

const defaultItems: DescriptionItem[] = [
  { key: "user-name", label: "姓名", children: "张三", span: 1 },
  { key: "user-phone", label: "电话", children: "13800138000", span: 1 },
  { key: "user-address", label: "地址", children: "上海市浦东新区", span: 2 },
];

function normalizeDescriptionsItems(items: unknown): DescriptionItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
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
    }))
    .filter((item) => item.key.trim() && item.label.trim());
}

function normalizeDescriptionsColumn(column: unknown) {
  const numericValue = Number(column);
  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : 3;
}

function normalizeDescriptionsSize(size: unknown): DescriptionsSize {
  return size === "middle" || size === "small" ? size : "default";
}

const DescriptionsRenderer = forwardRef<HTMLDivElement, DescriptionsProps>(
  ({ id, items, title, column = 3, bordered = false, size = "default", styles, ...props }, ref) => {
    const normalizedItems = useMemo(
      () => normalizeDescriptionsItems(items ?? defaultItems),
      [items],
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Descriptions
          {...materials.Descriptions.mapProps(
            {
              items: normalizedItems,
              title,
              column: normalizeDescriptionsColumn(column),
              bordered,
              size: normalizeDescriptionsSize(size),
              styles,
              ...props,
            },
            { mode: "preview" },
          )}
        />
      </div>
    );
  },
);

const DescriptionsEditorRenderer = forwardRef<HTMLDivElement, DescriptionsProps>(
  ({ id, items, title, column = 3, bordered = false, size = "default", styles, ...props }, ref) => {
    const normalizedItems = useMemo(
      () => normalizeDescriptionsItems(items ?? defaultItems),
      [items],
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Descriptions
          {...materials.Descriptions.mapProps(
            {
              items: normalizedItems,
              title,
              column: normalizeDescriptionsColumn(column),
              bordered,
              size: normalizeDescriptionsSize(size),
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        />
      </div>
    );
  },
);

DescriptionsRenderer.displayName = "DescriptionsRenderer";
DescriptionsEditorRenderer.displayName = "DescriptionsEditorRenderer";

export default createLeafMaterial({
  name: "Descriptions",
  category: "display",
  desc: "描述列表",
  defaultProps: {
    items: defaultItems,
    title: "基础信息",
    column: 3,
    bordered: false,
    size: "default",
  },
  allowedParents: [...DESCRIPTIONS_ALLOWED_PARENTS],
  setter: [
    field.descriptionsItems("items", "键值项"),
    field.input("title", "标题"),
    field.inputNumber("column", "列数"),
    field.switch("bordered", "带边框"),
    field.select("size", "尺寸", [
      { label: "默认", value: "default" },
      { label: "中等", value: "middle" },
      { label: "小", value: "small" },
    ]),
  ],
  render: DescriptionsRenderer,
  renderInEditor: DescriptionsEditorRenderer,
});
