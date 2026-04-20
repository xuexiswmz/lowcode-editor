import { Children, forwardRef, type ReactNode } from "react";
import type { CommonComponentProps } from "../../interface";
import { BADGE_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import { Badge, materials } from "../ui";

type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

type BadgeProps = Omit<CommonComponentProps, "children"> & {
  children?: ReactNode;
  count?: number | string;
  status?: BadgeStatus;
  text?: string;
  color?: string;
  dot?: boolean;
  overflowCount?: number;
  offsetX?: number;
  offsetY?: number;
};

const badgeStatusOptions = [
  { label: "默认", value: "default" },
  { label: "成功", value: "success" },
  { label: "处理中", value: "processing" },
  { label: "警告", value: "warning" },
  { label: "错误", value: "error" },
];

function normalizeBadgeStatus(status: unknown): BadgeStatus | undefined {
  return status === "success" ||
    status === "processing" ||
    status === "default" ||
    status === "error" ||
    status === "warning"
    ? status
    : undefined;
}

function normalizeBadgeOffset(offsetX: unknown, offsetY: unknown) {
  const normalizedOffsetX = Number(offsetX);
  const normalizedOffsetY = Number(offsetY);

  return [
    Number.isFinite(normalizedOffsetX) ? normalizedOffsetX : 0,
    Number.isFinite(normalizedOffsetY) ? normalizedOffsetY : 0,
  ] as [number, number];
}

const BadgeRenderer = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      id,
      count = 5,
      status,
      text = "状态文本",
      color,
      dot = false,
      overflowCount = 99,
      offsetX = 0,
      offsetY = 0,
      children,
      styles,
      ...props
    },
    ref,
  ) => {
    const hasChildren = Children.count(children) > 0;

    return (
      <div
        ref={ref}
        data-component-id={id}
        style={{ display: "inline-block", width: "fit-content" }}
      >
        <Badge
          {...materials.Badge.mapProps(
            {
              count: dot ? undefined : count,
              status: hasChildren ? undefined : normalizeBadgeStatus(status),
              text: hasChildren ? undefined : text,
              color,
              dot,
              overflowCount,
              offset: normalizeBadgeOffset(offsetX, offsetY),
              styles,
              ...props,
            },
            { mode: "preview" },
          )}
        >
          {hasChildren ? children : undefined}
        </Badge>
      </div>
    );
  },
);

const BadgeEditorRenderer = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      id,
      count = 5,
      status,
      text = "状态文本",
      color,
      dot = false,
      overflowCount = 99,
      offsetX = 0,
      offsetY = 0,
      children,
      styles,
      ...props
    },
    ref,
  ) => {
    const hasChildren = Children.count(children) > 0;

    return (
      <div
        ref={ref}
        data-component-id={id}
        style={{
          display: "inline-block",
          width: "fit-content",
          minWidth: hasChildren ? undefined : 88,
          minHeight: hasChildren ? undefined : 48,
          padding: hasChildren ? undefined : 8,
          border: hasChildren ? undefined : "1px dashed #d9d9d9",
          borderRadius: hasChildren ? undefined : 8,
        }}
      >
        <Badge
          {...materials.Badge.mapProps(
            {
              count: dot ? undefined : count,
              status: hasChildren ? undefined : normalizeBadgeStatus(status),
              text: hasChildren ? undefined : text,
              color,
              dot,
              overflowCount,
              offset: normalizeBadgeOffset(offsetX, offsetY),
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        >
          {hasChildren ? (
            children
          ) : (
            <span style={{ color: "#999", fontSize: 12 }}>拖入组件</span>
          )}
        </Badge>
      </div>
    );
  },
);

BadgeRenderer.displayName = "BadgeRenderer";
BadgeEditorRenderer.displayName = "BadgeEditorRenderer";

export default createContainerMaterial({
  name: "Badge",
  category: "display",
  desc: "徽标数",
  defaultProps: {
    count: 5,
    status: "default",
    text: "状态文本",
    color: "",
    dot: false,
    overflowCount: 99,
    offsetX: 0,
    offsetY: 0,
  },
  allowedParents: [...BADGE_ALLOWED_PARENTS],
  isContainer: true,
  setter: [
    field.input("count", "数量"),
    field.inputNumber("overflowCount", "最大显示数"),
    field.inputNumber("offsetX", "横向偏移"),
    field.inputNumber("offsetY", "纵向偏移"),
    field.select("status", "状态", badgeStatusOptions),
    field.input("text", "文本"),
    field.input("color", "颜色"),
    field.switch("dot", "圆点模式"),
  ],
  render: BadgeRenderer,
  renderInEditor: BadgeEditorRenderer,
});
