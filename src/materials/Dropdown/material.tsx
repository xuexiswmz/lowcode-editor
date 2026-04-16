import { DownOutlined } from "@ant-design/icons";
import { Button as AntdButton } from "antd";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { DROPDOWN_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Dropdown, materials } from "../ui";

type DropdownTrigger = "hover" | "click" | "contextMenu";
type DropdownPlacement =
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "top"
  | "topLeft"
  | "topRight";

export interface DropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownMaterialRef {
  open: () => void;
  close: () => void;
}

type DropdownProps = Omit<CommonComponentProps, "children"> & {
  menu?: DropdownMenuItem[];
  trigger?: DropdownTrigger;
  placement?: DropdownPlacement;
  disabled?: boolean;
};

const defaultMenuItems: DropdownMenuItem[] = [
  { key: "menu1", label: "菜单一" },
  { key: "menu2", label: "菜单二" },
];

function normalizeDropdownMenuItems(menu: unknown): DropdownMenuItem[] {
  if (!Array.isArray(menu)) {
    return [];
  }

  return menu
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

function normalizeTrigger(trigger: unknown): DropdownTrigger {
  return trigger === "click" || trigger === "contextMenu" ? trigger : "hover";
}

function normalizePlacement(placement: unknown): DropdownPlacement {
  return placement === "bottom" ||
    placement === "bottomRight" ||
    placement === "top" ||
    placement === "topLeft" ||
    placement === "topRight"
    ? placement
    : "bottomLeft";
}

function useDropdownState() {
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
  }

  function openDropdown() {
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
  }

  return {
    open,
    handleOpenChange,
    openDropdown,
    closeDropdown,
  };
}

function DropdownTriggerButton({ disabled }: { disabled?: boolean }) {
  return (
    <AntdButton disabled={disabled}>
      下拉菜单 <DownOutlined />
    </AntdButton>
  );
}

function renderDropdownPopup(id: number, originNode: ReactNode) {
  return (
    <span
      data-component-id={id}
      style={{ display: "inline-block", width: "max-content" }}
    >
      {originNode}
    </span>
  );
}

const DropdownRenderer = forwardRef<DropdownMaterialRef, DropdownProps>(
  (
    {
      id,
      menu,
      trigger = "hover",
      placement = "bottomLeft",
      disabled = false,
      onOpenChange,
      onClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const menuItems = useMemo(
      () => normalizeDropdownMenuItems(menu ?? defaultMenuItems),
      [menu],
    );
    const { open, handleOpenChange, openDropdown, closeDropdown } =
      useDropdownState();

    useImperativeHandle(
      ref,
      () => ({
        open: openDropdown,
        close: closeDropdown,
      }),
      [closeDropdown, openDropdown],
    );

    return (
      <div data-component-id={id}>
        <Dropdown
          {...materials.Dropdown.mapProps(
            {
              menu: {
                items: menuItems,
                onClick: (info: { key: string; domEvent?: MouseEvent }) => {
                  info.domEvent?.stopPropagation?.();
                  onClick?.(info);
                },
              },
              trigger: normalizeTrigger(trigger),
              placement: normalizePlacement(placement),
              disabled,
              open,
              autoAdjustOverflow: false,
              minOverlayWidthMatchTrigger: false,
              popupRender: (originNode: ReactNode) =>
                renderDropdownPopup(id, originNode),
              onOpenChange: (nextOpen: boolean) => {
                handleOpenChange(nextOpen);
                onOpenChange?.(nextOpen);
              },
              styles,
              ...props,
            },
            { mode: "preview" },
          )}
        >
          <span>
            <DropdownTriggerButton disabled={disabled} />
          </span>
        </Dropdown>
      </div>
    );
  },
);

const DropdownEditorRenderer = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      id,
      menu,
      trigger = "hover",
      placement = "bottomLeft",
      disabled = false,
      onOpenChange,
      onClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const menuItems = useMemo(
      () => normalizeDropdownMenuItems(menu ?? defaultMenuItems),
      [menu],
    );
    const { open, handleOpenChange } = useDropdownState();

    return (
      <div ref={ref} data-component-id={id}>
        <Dropdown
          {...materials.Dropdown.mapProps(
            {
              menu: {
                items: menuItems,
                onClick: (info: { key: string; domEvent?: MouseEvent }) => {
                  info.domEvent?.stopPropagation?.();
                  onClick?.(info);
                },
              },
              trigger: normalizeTrigger(trigger),
              placement: normalizePlacement(placement),
              disabled,
              open,
              autoAdjustOverflow: false,
              minOverlayWidthMatchTrigger: false,
              popupRender: (originNode: ReactNode) =>
                renderDropdownPopup(id, originNode),
              onOpenChange: (nextOpen: boolean) => {
                handleOpenChange(nextOpen);
                onOpenChange?.(nextOpen);
              },
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        >
          <span>
            <DropdownTriggerButton disabled={disabled} />
          </span>
        </Dropdown>
      </div>
    );
  },
);

DropdownRenderer.displayName = "DropdownRenderer";
DropdownEditorRenderer.displayName = "DropdownEditorRenderer";

export default createLeafMaterial({
  name: "Dropdown",
  category: "navigation",
  desc: "下拉菜单",
  defaultProps: {
    menu: defaultMenuItems,
    trigger: "hover",
    placement: "bottomLeft",
    disabled: false,
  },
  allowedParents: [...DROPDOWN_ALLOWED_PARENTS],
  setter: [
    field.dropdownMenuItems("menu", "菜单项"),
    field.select("trigger", "触发方式", [
      { label: "悬停", value: "hover" },
      { label: "点击", value: "click" },
      { label: "右键", value: "contextMenu" },
    ]),
    field.select("placement", "弹出位置", [
      { label: "下左", value: "bottomLeft" },
      { label: "下中", value: "bottom" },
      { label: "下右", value: "bottomRight" },
      { label: "上左", value: "topLeft" },
      { label: "上中", value: "top" },
      { label: "上右", value: "topRight" },
    ]),
    field.switch("disabled", "禁用"),
  ],
  events: [
    { name: "onOpenChange", label: "开关事件" },
    { name: "onClick", label: "菜单点击事件" },
  ],
  methods: [
    { name: "open", label: "打开" },
    { name: "close", label: "关闭" },
  ],
  render: DropdownRenderer,
  renderInEditor: DropdownEditorRenderer,
});
