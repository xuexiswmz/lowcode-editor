import {
  Children,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { POPOVER_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import type { MaterialComponent } from "../types";
import { Popover, materials } from "../ui";
import { getComponentPopupContainer } from "../shared/popup";

type PopoverPlacement =
  | "top"
  | "topLeft"
  | "topRight"
  | "left"
  | "leftTop"
  | "leftBottom"
  | "right"
  | "rightTop"
  | "rightBottom"
  | "bottom"
  | "bottomLeft"
  | "bottomRight";

type PopoverTrigger = "hover" | "click" | "contextMenu";

export interface PopoverRef {
  open: () => void;
  close: () => void;
}

type PopoverProps = CommonComponentProps & {
  title?: string;
  content?: string;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  onOpenChange?: (open: boolean) => void;
};

function normalizePopoverPlacement(placement: unknown): PopoverPlacement {
  const nextPlacement = String(placement ?? "");
  return [
    "top",
    "topLeft",
    "topRight",
    "left",
    "leftTop",
    "leftBottom",
    "right",
    "rightTop",
    "rightBottom",
    "bottom",
    "bottomLeft",
    "bottomRight",
  ].includes(nextPlacement)
    ? (nextPlacement as PopoverPlacement)
    : "top";
}

function normalizePopoverTrigger(trigger: unknown): PopoverTrigger {
  const nextTrigger = String(trigger ?? "");
  return nextTrigger === "click" || nextTrigger === "contextMenu"
    ? (nextTrigger as PopoverTrigger)
    : "hover";
}

function renderPopoverTrigger(children?: ReactNode) {
  const hasChildren = Children.count(children) > 0;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
        minHeight: 36,
      }}
    >
      {hasChildren ? children : (
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px dashed #d9d9d9",
            background: "#fafafa",
            color: "#666",
            fontSize: 12,
          }}
        >
          气泡卡片触发器
        </span>
      )}
    </div>
  );
}

function renderPopoverEditorSurface(children?: ReactNode) {
  const hasChildren = Children.count(children) > 0;

  return (
    <div
      style={{
        width: "100%",
        minHeight: 72,
        padding: 12,
        border: "1px dashed #d9d9d9",
        borderRadius: 8,
        background: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasChildren ? (
        renderPopoverTrigger(children)
      ) : (
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px dashed #91caff",
            background: "#f0f7ff",
            color: "#1677ff",
            fontSize: 12,
          }}
        >
          气泡卡片触发器
        </span>
      )}
    </div>
  );
}

const PopoverRenderer = forwardRef<PopoverRef, PopoverProps>(
  (
    {
      title = "标题",
      content = "这里是气泡卡片内容",
      placement = "top",
      trigger = "hover",
      children,
      onOpenChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState<boolean | undefined>(undefined);
    const hasChildren = Children.count(children) > 0;

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
      }),
      [],
    );

    const popoverProps = useMemo(
      () =>
        materials.Popover.mapProps(
          {
            title,
            content: content || undefined,
            placement: normalizePopoverPlacement(placement),
            trigger: normalizePopoverTrigger(trigger),
            open,
            getPopupContainer: getComponentPopupContainer,
            onOpenChange: (nextOpen: boolean) => {
              setOpen(nextOpen ? true : undefined);
              onOpenChange?.(nextOpen);
            },
            styles,
            ...props,
          },
          { mode: "preview" },
        ),
      [content, onOpenChange, open, placement, props, styles, title, trigger],
    );

    return (
      <Popover {...popoverProps}>
        {hasChildren ? (
          renderPopoverTrigger(children)
        ) : (
          renderPopoverEditorSurface()
        )}
      </Popover>
    );
  },
);

const PopoverEditorRenderer = forwardRef<HTMLDivElement, PopoverProps>(
  ({ id, title = "标题", content = "这里是气泡卡片内容", placement = "top", trigger = "hover", children, styles, ...props }, ref) => {
    const popoverProps = materials.Popover.mapProps(
      {
        title,
        content: content || undefined,
        placement: normalizePopoverPlacement(placement),
        trigger: normalizePopoverTrigger(trigger),
        getPopupContainer: getComponentPopupContainer,
        styles,
        ...props,
      },
      { mode: "editor" },
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Popover {...popoverProps}>
          {renderPopoverEditorSurface(children)}
        </Popover>
      </div>
    );
  },
);

PopoverRenderer.displayName = "PopoverRenderer";
PopoverEditorRenderer.displayName = "PopoverEditorRenderer";

export default createContainerMaterial({
  name: "Popover",
  category: "feedback",
  desc: "气泡卡片",
  defaultProps: {
    title: "标题",
    content: "这里是气泡卡片内容",
    placement: "top",
    trigger: "hover",
  },
  isContainer: true,
  allowedParents: [...POPOVER_ALLOWED_PARENTS],
  setter: [
    field.input("title", "标题"),
    field.textarea("content", "内容"),
    field.select("placement", "弹出位置", [
      { label: "上", value: "top" },
      { label: "上左", value: "topLeft" },
      { label: "上右", value: "topRight" },
      { label: "左", value: "left" },
      { label: "左上", value: "leftTop" },
      { label: "左下", value: "leftBottom" },
      { label: "右", value: "right" },
      { label: "右上", value: "rightTop" },
      { label: "右下", value: "rightBottom" },
      { label: "下", value: "bottom" },
      { label: "下左", value: "bottomLeft" },
      { label: "下右", value: "bottomRight" },
    ]),
    field.select("trigger", "触发方式", [
      { label: "悬浮", value: "hover" },
      { label: "点击", value: "click" },
      { label: "右键", value: "contextMenu" },
    ]),
  ],
  events: [{ name: "onOpenChange", label: "开关事件" }],
  methods: [
    { name: "open", label: "打开气泡卡片" },
    { name: "close", label: "关闭气泡卡片" },
  ],
  render: PopoverRenderer as MaterialComponent<CommonComponentProps>,
  renderInEditor: PopoverEditorRenderer,
});
