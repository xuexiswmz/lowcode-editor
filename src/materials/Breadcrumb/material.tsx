import { forwardRef, useMemo } from "react";
import type { ReactNode } from "react";
import type { CommonComponentProps } from "../../interface";
import { BREADCRUMB_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Breadcrumb, materials } from "../ui";

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

type BreadcrumbProps = Omit<CommonComponentProps, "children"> & {
  items?: BreadcrumbItem[];
  separator?: ReactNode;
};

const defaultItems: BreadcrumbItem[] = [
  { title: "首页", href: "/" },
  { title: "列表页", href: "/list" },
  { title: "详情页" },
];

function normalizeBreadcrumbItems(items: unknown): BreadcrumbItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
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

function useBreadcrumbItems(
  items: BreadcrumbItem[] | undefined,
  onClick: CommonComponentProps["onClick"],
) {
  return useMemo(
    () =>
      normalizeBreadcrumbItems(items ?? defaultItems).map((item, index) => ({
        ...item,
        title: item.href ? (
          <a
            href={item.href}
            onClick={(event) => {
              event.preventDefault();
              onClick?.({
                item,
                index,
                event,
              });
            }}
          >
            {item.title}
          </a>
        ) : (
          <span
            onClick={(event) => {
              onClick?.({
                item,
                index,
                event,
              });
            }}
          >
            {item.title}
          </span>
        ),
      })),
    [items, onClick],
  );
}

const BreadcrumbRenderer = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ id, items, separator = "/", onClick, styles, ...props }, ref) => {
    const breadcrumbItems = useBreadcrumbItems(items, onClick);

    return (
      <div ref={ref} data-component-id={id}>
        <Breadcrumb
          {...materials.Breadcrumb.mapProps(
            {
              items: breadcrumbItems,
              separator,
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

const BreadcrumbEditorRenderer = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ id, items, separator = "/", onClick, styles, ...props }, ref) => {
    const breadcrumbItems = useBreadcrumbItems(items, onClick);

    return (
      <div ref={ref} data-component-id={id}>
        <Breadcrumb
          {...materials.Breadcrumb.mapProps(
            {
              items: breadcrumbItems,
              separator,
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

BreadcrumbRenderer.displayName = "BreadcrumbRenderer";
BreadcrumbEditorRenderer.displayName = "BreadcrumbEditorRenderer";

export default createLeafMaterial({
  name: "Breadcrumb",
  category: "navigation",
  desc: "面包屑",
  defaultProps: {
    items: defaultItems,
    separator: "/",
  },
  allowedParents: [...BREADCRUMB_ALLOWED_PARENTS],
  setter: [
    field.breadcrumbItems("items", "项目"),
    field.input("separator", "分隔符"),
  ],
  events: [{ name: "onClick", label: "点击事件" }],
  render: BreadcrumbRenderer,
  renderInEditor: BreadcrumbEditorRenderer,
});
