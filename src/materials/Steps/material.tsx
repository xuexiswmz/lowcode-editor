import { forwardRef, useMemo } from "react";
import type { CommonComponentProps } from "../../interface";
import { STEPS_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Steps, materials } from "../ui";

type StepStatus = "wait" | "process" | "finish" | "error";
type StepsDirection = "horizontal" | "vertical";
type StepsSize = "medium" | "small" | "default";

export interface StepItem {
  title: string;
  description?: string;
  content?: string;
}

type StepsProps = Omit<CommonComponentProps, "children"> & {
  current?: number;
  direction?: StepsDirection;
  size?: StepsSize;
  items?: StepItem[];
  status?: StepStatus;
};

const defaultItems: StepItem[] = [
  { title: "第一步", description: "开始处理" },
  { title: "第二步", description: "进行中" },
  { title: "第三步", description: "等待完成" },
];

function normalizeStepItems(items: unknown): StepItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item): item is StepItem =>
        typeof item === "object" && item !== null && "title" in item,
    )
    .map((item) => ({
      title: String(item.title),
      content:
        typeof item.content === "string" && item.content.trim()
          ? item.content
          : typeof item.description === "string" && item.description.trim()
            ? item.description
            : undefined,
      description:
        typeof item.description === "string" && item.description.trim()
          ? item.description
          : undefined,
    }))
    .filter((item) => item.title.trim());
}

function getNormalizedCurrent(current: unknown, items: StepItem[]) {
  const numericValue = Number(current);
  if (!Number.isInteger(numericValue) || numericValue < 0) {
    return 0;
  }

  if (items.length === 0) {
    return 0;
  }

  return Math.min(numericValue, items.length - 1);
}

function normalizeStepsSize(size: unknown): "medium" | "small" {
  return size === "small" ? "small" : "medium";
}

function useStepsItems(items: StepItem[] | undefined) {
  return useMemo(
    () => normalizeStepItems(items ?? defaultItems),
    [items],
  );
}

const StepsRenderer = forwardRef<HTMLDivElement, StepsProps>(
  (
    {
      id,
      current = 0,
      direction = "horizontal",
      size = "medium",
      items,
      status,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const stepsItems = useStepsItems(items);

    return (
      <div ref={ref} data-component-id={id}>
        <Steps
          {...materials.Steps.mapProps(
            {
              current: getNormalizedCurrent(current, stepsItems),
              direction,
              size: normalizeStepsSize(size),
              items: stepsItems,
              status,
              onChange,
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

const StepsEditorRenderer = forwardRef<HTMLDivElement, StepsProps>(
  (
    {
      id,
      current = 0,
      direction = "horizontal",
      size = "medium",
      items,
      status,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const stepsItems = useStepsItems(items);

    return (
      <div ref={ref} data-component-id={id}>
        <Steps
          {...materials.Steps.mapProps(
            {
              current: getNormalizedCurrent(current, stepsItems),
              direction,
              size: normalizeStepsSize(size),
              items: stepsItems,
              status,
              onChange,
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

StepsRenderer.displayName = "StepsRenderer";
StepsEditorRenderer.displayName = "StepsEditorRenderer";

export default createLeafMaterial({
  name: "Steps",
  category: "navigation",
  desc: "步骤条",
  defaultProps: {
    current: 1,
    direction: "horizontal",
    size: "medium",
    status: "process",
    items: defaultItems,
  },
  allowedParents: [...STEPS_ALLOWED_PARENTS],
  setter: [
    field.inputNumber("current", "当前步骤"),
    field.select("direction", "方向", [
      { label: "横向", value: "horizontal" },
      { label: "纵向", value: "vertical" },
    ]),
    field.select("size", "尺寸", [
      { label: "默认", value: "medium" },
      { label: "小", value: "small" },
    ]),
    field.stepsItems("items", "步骤项"),
    field.select("status", "状态", [
      { label: "等待", value: "wait" },
      { label: "进行中", value: "process" },
      { label: "完成", value: "finish" },
      { label: "错误", value: "error" },
    ]),
  ],
  events: [{ name: "onChange", label: "切换事件" }],
  render: StepsRenderer,
  renderInEditor: StepsEditorRenderer,
});
