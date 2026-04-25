import {
  Children,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { TOOLTIP_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import type { MaterialComponent } from "../types";
import { Tooltip, materials } from "../ui";
import { getComponentPopupContainer } from "../shared/popup";

type TooltipPlacement =
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

type TooltipTrigger = "hover" | "click" | "contextMenu";

export interface TooltipRef {
  open: () => void;
  close: () => void;
}

type TooltipProps = CommonComponentProps & {
  title?: string;
  placement?: TooltipPlacement;
  color?: string;
  trigger?: TooltipTrigger;
  onOpenChange?: (open: boolean) => void;
};

function normalizeTooltipPlacement(placement: unknown): TooltipPlacement {
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
    ? (nextPlacement as TooltipPlacement)
    : "top";
}

function normalizeTooltipTrigger(trigger: unknown): TooltipTrigger {
  const nextTrigger = String(trigger ?? "");
  return nextTrigger === "click" || nextTrigger === "contextMenu"
    ? (nextTrigger as TooltipTrigger)
    : "hover";
}

function renderTooltipTrigger(children?: ReactNode) {
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
          文字提示触发器
        </span>
      )}
    </div>
  );
}

function renderTooltipEditorSurface(children?: ReactNode) {
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
        renderTooltipTrigger(children)
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
          文字提示触发器
        </span>
      )}
    </div>
  );
}

const TooltipRenderer = forwardRef<TooltipRef, TooltipProps>(
  (
    {
      title = "这里是提示内容",
      placement = "top",
      color,
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

    const tooltipProps = useMemo(
      () =>
        materials.Tooltip.mapProps(
          {
            title,
            placement: normalizeTooltipPlacement(placement),
            color: color || undefined,
            trigger: normalizeTooltipTrigger(trigger),
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
      [color, onOpenChange, open, placement, props, styles, title, trigger],
    );

    return (
      <Tooltip {...tooltipProps}>
        {hasChildren ? (
          renderTooltipTrigger(children)
        ) : (
          renderTooltipEditorSurface()
        )}
      </Tooltip>
    );
  },
);

const TooltipEditorRenderer = forwardRef<HTMLDivElement, TooltipProps>(
  ({ id, title = "这里是提示内容", placement = "top", color, trigger = "hover", children, styles, ...props }, ref) => {
    const tooltipProps = materials.Tooltip.mapProps(
      {
        title,
        placement: normalizeTooltipPlacement(placement),
        color: color || undefined,
        trigger: normalizeTooltipTrigger(trigger),
        getPopupContainer: getComponentPopupContainer,
        styles,
        ...props,
      },
      { mode: "editor" },
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Tooltip {...tooltipProps}>
          {renderTooltipEditorSurface(children)}
        </Tooltip>
      </div>
    );
  },
);

TooltipRenderer.displayName = "TooltipRenderer";
TooltipEditorRenderer.displayName = "TooltipEditorRenderer";

export default createContainerMaterial({
  name: "Tooltip",
  category: "feedback",
  desc: "文字提示",
  defaultProps: {
    title: "这里是提示内容",
    placement: "top",
    color: "",
    trigger: "hover",
  },
  isContainer: true,
  allowedParents: [...TOOLTIP_ALLOWED_PARENTS],
  setter: [
    field.input("title", "提示内容"),
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
    field.input("color", "颜色"),
    field.select("trigger", "触发方式", [
      { label: "悬浮", value: "hover" },
      { label: "点击", value: "click" },
      { label: "右键", value: "contextMenu" },
    ]),
  ],
  events: [{ name: "onOpenChange", label: "开关事件" }],
  methods: [
    { name: "open", label: "打开提示" },
    { name: "close", label: "关闭提示" },
  ],
  render: TooltipRenderer as MaterialComponent<CommonComponentProps>,
  renderInEditor: TooltipEditorRenderer,
});
