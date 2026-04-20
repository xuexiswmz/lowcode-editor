import { forwardRef, useMemo } from "react";
import type { CommonComponentProps } from "../../interface";
import { LIST_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { List, materials } from "../ui";

type ListItemLayout = "horizontal" | "vertical";
type ListSize = "default" | "small" | "large";

export interface ListDataItem {
  key: string;
  title: string;
  description?: string;
  extra?: string;
}

type ListProps = Omit<CommonComponentProps, "children"> & {
  dataSource?: ListDataItem[];
  itemLayout?: ListItemLayout;
  bordered?: boolean;
  size?: ListSize;
  header?: string;
  footer?: string;
};

const defaultDataSource: ListDataItem[] = [
  {
    key: "list-1",
    title: "列表项一",
    description: "这里是列表项一的描述信息",
    extra: "操作",
  },
  {
    key: "list-2",
    title: "列表项二",
    description: "这里是列表项二的描述信息",
    extra: "查看",
  },
  {
    key: "list-3",
    title: "列表项三",
    description: "这里是列表项三的描述信息",
  },
];

function normalizeListDataSource(value: unknown): ListDataItem[] {
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
        typeof item.description === "string" && item.description.trim()
          ? item.description
          : undefined,
      extra:
        typeof item.extra === "string" && item.extra.trim()
          ? item.extra
          : undefined,
    }));
}

function normalizeListItemLayout(itemLayout: unknown): ListItemLayout {
  return itemLayout === "vertical" ? "vertical" : "horizontal";
}

function normalizeListSize(size: unknown): ListSize {
  return size === "small" || size === "large" ? size : "default";
}

const ListRenderer = forwardRef<HTMLDivElement, ListProps>(
  (
    {
      id,
      dataSource,
      itemLayout = "horizontal",
      bordered = false,
      size = "default",
      header,
      footer,
      onClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedDataSource = useMemo(
      () => normalizeListDataSource(dataSource ?? defaultDataSource),
      [dataSource],
    );
    const normalizedItemLayout = normalizeListItemLayout(itemLayout);

    return (
      <div ref={ref} data-component-id={id}>
        <List
          {...materials.List.mapProps(
            {
              dataSource: normalizedDataSource,
              itemLayout: normalizedItemLayout,
              bordered,
              size: normalizeListSize(size),
              header,
              footer,
              renderItem: (item: ListDataItem, index: number) => (
                <List.Item
                  key={item.key || `list-item-${index}`}
                  extra={item.extra ? <span>{item.extra}</span> : undefined}
                  onClick={(event) => onClick?.({ item, index, event })}
                  style={{ cursor: onClick ? "pointer" : undefined }}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              ),
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

const ListEditorRenderer = forwardRef<HTMLDivElement, ListProps>(
  (
    {
      id,
      dataSource,
      itemLayout = "horizontal",
      bordered = false,
      size = "default",
      header,
      footer,
      onClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedDataSource = useMemo(
      () => normalizeListDataSource(dataSource ?? defaultDataSource),
      [dataSource],
    );
    const normalizedItemLayout = normalizeListItemLayout(itemLayout);

    if (normalizedDataSource.length === 0) {
      return (
        <div
          ref={ref}
          data-component-id={id}
          style={{
            minHeight: 96,
            padding: 16,
            border: "1px dashed #d9d9d9",
            borderRadius: 8,
            background: "#fafafa",
            color: "#999",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...(typeof styles === "object" && styles !== null ? styles : {}),
          }}
        >
          请在右侧新增 List 数据项
        </div>
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <List
          {...materials.List.mapProps(
            {
              dataSource: normalizedDataSource,
              itemLayout: normalizedItemLayout,
              bordered,
              size: normalizeListSize(size),
              header,
              footer,
              renderItem: (item: ListDataItem, index: number) => (
                <List.Item
                  key={item.key || `list-item-${index}`}
                  extra={item.extra ? <span>{item.extra}</span> : undefined}
                  onClick={(event) => onClick?.({ item, index, event })}
                  style={{ cursor: onClick ? "pointer" : undefined }}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              ),
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

ListRenderer.displayName = "ListRenderer";
ListEditorRenderer.displayName = "ListEditorRenderer";

export default createLeafMaterial({
  name: "List",
  category: "display",
  desc: "列表",
  defaultProps: {
    dataSource: defaultDataSource,
    itemLayout: "horizontal",
    bordered: false,
    size: "default",
    header: "列表头部",
    footer: "",
  },
  allowedParents: [...LIST_ALLOWED_PARENTS],
  setter: [
    field.listDataSource("dataSource", "数据源"),
    field.select("itemLayout", "布局", [
      { label: "水平", value: "horizontal" },
      { label: "垂直", value: "vertical" },
    ]),
    field.switch("bordered", "带边框"),
    field.select("size", "尺寸", [
      { label: "默认", value: "default" },
      { label: "小", value: "small" },
      { label: "大", value: "large" },
    ]),
    field.input("header", "头部"),
    field.input("footer", "底部"),
  ],
  events: [{ name: "onClick", label: "点击事件" }],
  render: ListRenderer,
  renderInEditor: ListEditorRenderer,
});
