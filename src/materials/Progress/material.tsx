import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { PROGRESS_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Progress, materials } from "../ui";

type ProgressStatus = "success" | "exception" | "normal" | "active";
type ProgressType = "line" | "circle" | "dashboard";

type ProgressProps = Omit<CommonComponentProps, "children"> & {
  percent?: number;
  status?: ProgressStatus;
  type?: ProgressType;
  strokeColor?: string;
  showInfo?: boolean;
};

const progressStatusOptions = [
  { label: "正常", value: "normal" },
  { label: "进行中", value: "active" },
  { label: "成功", value: "success" },
  { label: "异常", value: "exception" },
];

const progressTypeOptions = [
  { label: "线形", value: "line" },
  { label: "圆形", value: "circle" },
  { label: "仪表盘", value: "dashboard" },
];

function normalizePercent(percent: unknown) {
  const numericValue = Number(percent);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(Math.max(numericValue, 0), 100);
}

function normalizeProgressStatus(status: unknown): ProgressStatus {
  return status === "success" ||
    status === "exception" ||
    status === "active"
    ? status
    : "normal";
}

function normalizeProgressType(type: unknown): ProgressType {
  return type === "circle" || type === "dashboard" ? type : "line";
}

const ProgressRenderer = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      id,
      percent = 30,
      status = "normal",
      type = "line",
      strokeColor,
      showInfo = true,
      styles,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{
        display: "inline-block",
        width: normalizeProgressType(type) === "line" ? "100%" : "fit-content",
      }}
    >
      <Progress
        {...materials.Progress.mapProps(
          {
            percent: normalizePercent(percent),
            status: normalizeProgressStatus(status),
            type: normalizeProgressType(type),
            strokeColor,
            showInfo,
            styles,
            ...props,
          },
          { mode: "preview" },
        )}
      />
    </div>
  ),
);

const ProgressEditorRenderer = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      id,
      percent = 30,
      status = "normal",
      type = "line",
      strokeColor,
      showInfo = true,
      styles,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{
        display: "inline-block",
        width: normalizeProgressType(type) === "line" ? "100%" : "fit-content",
      }}
    >
      <Progress
        {...materials.Progress.mapProps(
          {
            percent: normalizePercent(percent),
            status: normalizeProgressStatus(status),
            type: normalizeProgressType(type),
            strokeColor,
            showInfo,
            styles,
            ...props,
          },
          { mode: "editor" },
        )}
      />
    </div>
  ),
);

ProgressRenderer.displayName = "ProgressRenderer";
ProgressEditorRenderer.displayName = "ProgressEditorRenderer";

export default createLeafMaterial({
  name: "Progress",
  category: "display",
  desc: "进度条",
  defaultProps: {
    percent: 30,
    status: "normal",
    type: "line",
    strokeColor: "",
    showInfo: true,
  },
  allowedParents: [...PROGRESS_ALLOWED_PARENTS],
  setter: [
    field.inputNumber("percent", "进度"),
    field.select("status", "状态", progressStatusOptions),
    field.select("type", "类型", progressTypeOptions),
    field.input("strokeColor", "进度条颜色"),
    field.switch("showInfo", "显示进度数值"),
  ],
  render: ProgressRenderer,
  renderInEditor: ProgressEditorRenderer,
});
