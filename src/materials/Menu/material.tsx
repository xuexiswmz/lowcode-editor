import {
  AppstoreOutlined,
  FileOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  ReadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { forwardRef, useMemo, type ReactNode } from "react";
import type { CommonComponentProps } from "../../interface";
import { MENU_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import {
  normalizeMenuItems,
  normalizeMenuMode,
  normalizeMenuSelectedKeys,
  normalizeMenuTheme,
  useManagedMenuSelection,
  type MenuItemConfig,
  type MenuMode,
  type MenuTheme,
} from "../shared/menu";
import { getComponentPopupContainer } from "../shared/popup";
import { Menu, materials } from "../ui";

type MenuProps = Omit<CommonComponentProps, "children"> & {
  items?: MenuItemConfig[];
  mode?: MenuMode;
  selectedKeys?: string[];
  theme?: MenuTheme;
  inlineCollapsed?: boolean;
};

const defaultItems: MenuItemConfig[] = [
  { key: "dashboard", label: "首页" },
  {
    key: "product",
    label: "产品中心",
    children: [
      { key: "product-list", label: "产品列表" },
      { key: "product-detail", label: "产品详情" },
    ],
  },
  { key: "about", label: "关于我们" },
];

const collapsedMenuIcons = [
  HomeOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  ReadOutlined,
  SettingOutlined,
  FileOutlined,
] as const;

function createCollapsedMenuIcon(seed: string): ReactNode {
  const Icon =
    collapsedMenuIcons[
      Math.abs(
        Array.from(seed).reduce(
          (sum, char) => sum + char.charCodeAt(0),
          0,
        ),
      ) % collapsedMenuIcons.length
    ];

  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor",
        fontSize: 16,
        lineHeight: 1,
      }}
    >
      <Icon />
    </span>
  );
}

function mapMenuItemsForDisplay(
  items: MenuItemConfig[],
  withCollapsedIcons: boolean,
  depth = 0,
): Array<MenuItemConfig & { title: string; icon?: ReactNode }> {
  return items.map((item) => ({
    ...item,
    title: item.label,
    icon:
      withCollapsedIcons && depth === 0
        ? createCollapsedMenuIcon(item.key)
        : undefined,
    children: item.children
      ? mapMenuItemsForDisplay(item.children, withCollapsedIcons, depth + 1)
      : undefined,
  }));
}

function useMenuState(
  id: number,
  items: MenuItemConfig[],
  selectedKeys: unknown,
) {
  const { selectedKeys: managedSelectedKeys, updateSelectedKeys } =
    useManagedMenuSelection(id, selectedKeys, items);

  function selectMenuItem(key: string) {
    const nextSelectedKeys = normalizeMenuSelectedKeys([key], items);
    updateSelectedKeys(nextSelectedKeys);
    return nextSelectedKeys;
  }

  return {
    selectedKeys: managedSelectedKeys,
    selectMenuItem,
  };
}

const MenuRenderer = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      id,
      items,
      mode = "inline",
      selectedKeys,
      theme = "light",
      inlineCollapsed = false,
      onClick,
      onSelect,
      onOpenChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedMode = normalizeMenuMode(mode);
    const menuItems = useMemo(
      () => normalizeMenuItems(items ?? defaultItems),
      [items],
    );
    const { selectedKeys: managedSelectedKeys, selectMenuItem } = useMenuState(
      id,
      menuItems,
      selectedKeys,
    );
    const renderedItems = useMemo(
      () =>
        mapMenuItemsForDisplay(
          menuItems,
          normalizedMode === "inline" && inlineCollapsed,
        ),
      [inlineCollapsed, menuItems, normalizedMode],
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Menu
          {...materials.Menu.mapProps(
            {
              items: renderedItems,
              mode: normalizedMode,
              selectedKeys: managedSelectedKeys,
              theme: normalizeMenuTheme(theme),
              inlineCollapsed: normalizedMode === "inline" ? inlineCollapsed : false,
              getPopupContainer: getComponentPopupContainer,
              onClick: (info: { key: string }) => {
                const nextSelectedKeys = selectMenuItem(info.key);
                onClick?.({
                  ...info,
                  selectedKeys: nextSelectedKeys,
                });
              },
              onSelect: (info: { selectedKeys: string[]; key: string }) => {
                onSelect?.(info);
              },
              onOpenChange,
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

const MenuEditorRenderer = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      id,
      items,
      mode = "inline",
      selectedKeys,
      theme = "light",
      inlineCollapsed = false,
      onClick,
      onSelect,
      onOpenChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedMode = normalizeMenuMode(mode);
    const menuItems = useMemo(
      () => normalizeMenuItems(items ?? defaultItems),
      [items],
    );
    const { selectedKeys: managedSelectedKeys, selectMenuItem } = useMenuState(
      id,
      menuItems,
      selectedKeys,
    );
    const renderedItems = useMemo(
      () =>
        mapMenuItemsForDisplay(
          menuItems,
          normalizedMode === "inline" && inlineCollapsed,
        ),
      [inlineCollapsed, menuItems, normalizedMode],
    );

    if (menuItems.length === 0) {
      return (
        <div
          ref={ref}
          data-component-id={id}
          style={{
            minHeight: 120,
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
          请在右侧新增 Menu 菜单项
        </div>
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <Menu
          {...materials.Menu.mapProps(
            {
              items: renderedItems,
              mode: normalizedMode,
              selectedKeys: managedSelectedKeys,
              theme: normalizeMenuTheme(theme),
              inlineCollapsed: normalizedMode === "inline" ? inlineCollapsed : false,
              getPopupContainer: getComponentPopupContainer,
              onClick: (info: { key: string }) => {
                const nextSelectedKeys = selectMenuItem(info.key);
                onClick?.({
                  ...info,
                  selectedKeys: nextSelectedKeys,
                });
              },
              onSelect: (info: { selectedKeys: string[]; key: string }) => {
                onSelect?.(info);
              },
              onOpenChange,
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

MenuRenderer.displayName = "MenuRenderer";
MenuEditorRenderer.displayName = "MenuEditorRenderer";

export default createLeafMaterial({
  name: "Menu",
  category: "navigation",
  desc: "导航菜单",
  defaultProps: {
    items: defaultItems,
    mode: "inline",
    selectedKeys: ["dashboard"],
    theme: "light",
    inlineCollapsed: false,
  },
  allowedParents: [...MENU_ALLOWED_PARENTS],
  setter: [
    field.menuItems("items", "菜单项"),
    field.select("selectedKeys", "当前选中", []),
    field.select("mode", "模式", [
      { label: "内联", value: "inline" },
      { label: "垂直", value: "vertical" },
      { label: "水平", value: "horizontal" },
    ]),
    field.select("theme", "主题", [
      { label: "浅色", value: "light" },
      { label: "深色", value: "dark" },
    ]),
    field.switch("inlineCollapsed", "收起内联菜单"),
  ],
  events: [
    { name: "onClick", label: "点击事件" },
    { name: "onSelect", label: "选中事件" },
    { name: "onOpenChange", label: "展开收起事件" },
  ],
  render: MenuRenderer,
  renderInEditor: MenuEditorRenderer,
});
