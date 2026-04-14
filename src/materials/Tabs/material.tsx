import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { useComponentsStore } from "../../stores/components";
import { TABS_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Tabs, materials } from "../ui";

type TabsType = "line" | "card" | "editable-card";
type TabPosition = "top" | "right" | "bottom" | "left";

export interface TabItem {
  key: string;
  label: string;
  children?: string;
  disabled?: boolean;
}

export interface TabsMaterialRef {
  switchTab: (key: string) => void;
}

type TabsProps = Omit<CommonComponentProps, "children"> & {
  items?: TabItem[];
  activeKey?: string;
  type?: TabsType;
  tabPosition?: TabPosition;
  centered?: boolean;
};

const defaultItems: TabItem[] = [
  { key: "tab1", label: "标签一", children: "标签一内容" },
  { key: "tab2", label: "标签二", children: "标签二内容" },
];

function normalizeTabItems(items: unknown): TabItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item): item is TabItem =>
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

function normalizeActiveKey(activeKey: unknown, items: TabItem[]) {
  const nextKey = String(activeKey ?? "");

  if (items.some((item) => item.key === nextKey)) {
    return nextKey;
  }

  return items[0]?.key;
}

function normalizeTabsType(type: unknown): TabsType {
  return type === "card" || type === "editable-card" ? type : "line";
}

function normalizeTabPosition(tabPosition: unknown): TabPosition {
  return tabPosition === "right" ||
    tabPosition === "bottom" ||
    tabPosition === "left"
    ? tabPosition
    : "top";
}

function useTabsState(id: number, activeKey: unknown, items: TabItem[]) {
  const { updateComponentProps } = useComponentsStore();
  const normalizedActiveKey = useMemo(
    () => normalizeActiveKey(activeKey, items),
    [activeKey, items],
  );

  useEffect(() => {
    if ((activeKey ?? undefined) !== normalizedActiveKey) {
      updateComponentProps(id, { activeKey: normalizedActiveKey });
    }
  }, [activeKey, id, normalizedActiveKey, updateComponentProps]);

  function switchTab(key: string) {
    const nextKey = normalizeActiveKey(key, items);
    updateComponentProps(id, { activeKey: nextKey });
    return nextKey;
  }

  return {
    activeKey: normalizedActiveKey,
    switchTab,
  };
}

const TabsRenderer = forwardRef<TabsMaterialRef, TabsProps>(
  (
    {
      id,
      items,
      activeKey,
      type = "line",
      tabPosition = "top",
      centered = false,
      onChange,
      onTabClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const tabItems = useMemo(
      () => normalizeTabItems(items ?? defaultItems),
      [items],
    );
    const { activeKey: managedActiveKey, switchTab } = useTabsState(
      id,
      activeKey,
      tabItems,
    );

    useImperativeHandle(
      ref,
      () => ({
        switchTab,
      }),
      [switchTab],
    );

    return (
      <Tabs
        {...materials.Tabs.mapProps(
          {
            items: tabItems,
            activeKey: managedActiveKey,
            type: normalizeTabsType(type),
            tabPosition: normalizeTabPosition(tabPosition),
            centered,
            onChange: (nextKey: string) => {
              switchTab(nextKey);
              onChange?.(nextKey);
            },
            onTabClick,
            styles,
            ...props,
          },
          { mode: "preview" },
        )}
      />
    );
  },
);

const TabsEditorRenderer = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      id,
      items,
      activeKey,
      type = "line",
      tabPosition = "top",
      centered = false,
      onChange,
      onTabClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const tabItems = useMemo(
      () => normalizeTabItems(items ?? defaultItems),
      [items],
    );
    const { activeKey: managedActiveKey, switchTab } = useTabsState(
      id,
      activeKey,
      tabItems,
    );

    if (tabItems.length === 0) {
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
          请在右侧新增 Tabs 面板
        </div>
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <Tabs
          {...materials.Tabs.mapProps(
            {
              items: tabItems,
              activeKey: managedActiveKey,
              type: normalizeTabsType(type),
              tabPosition: normalizeTabPosition(tabPosition),
              centered,
              onChange: (nextKey: string) => {
                switchTab(nextKey);
                onChange?.(nextKey);
              },
              onTabClick,
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

TabsRenderer.displayName = "TabsRenderer";
TabsEditorRenderer.displayName = "TabsEditorRenderer";

export default createLeafMaterial({
  name: "Tabs",
  category: "navigation",
  desc: "标签页",
  defaultProps: {
    items: defaultItems,
    activeKey: "tab1",
    type: "line",
    tabPosition: "top",
    centered: false,
  },
  allowedParents: [...TABS_ALLOWED_PARENTS],
  setter: [
    field.tabsItems("items", "面板"),
    field.select("activeKey", "当前面板", []),
    field.select("type", "类型", [
      { label: "线条", value: "line" },
      { label: "卡片", value: "card" },
      { label: "可编辑卡片", value: "editable-card" },
    ]),
    field.select("tabPosition", "标签位置", [
      { label: "上", value: "top" },
      { label: "右", value: "right" },
      { label: "下", value: "bottom" },
      { label: "左", value: "left" },
    ]),
    field.switch("centered", "居中"),
  ],
  events: [
    { name: "onChange", label: "切换事件" },
    { name: "onTabClick", label: "点击页签事件" },
  ],
  methods: [{ name: "switchTab", label: "切换页签" }],
  render: TabsRenderer,
  renderInEditor: TabsEditorRenderer,
});
