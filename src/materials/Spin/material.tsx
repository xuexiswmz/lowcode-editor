import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SPIN_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Spin, materials } from "../ui";

type SpinSize = "small" | "default" | "large";

type SpinProps = Omit<CommonComponentProps, "children"> & {
  spinning?: boolean;
  tip?: string;
  size?: SpinSize;
  fullscreen?: boolean;
};

function normalizeSpinSize(size: unknown): SpinSize {
  return size === "small" || size === "large" ? size : "default";
}

const SpinRenderer = forwardRef<HTMLDivElement, SpinProps>(
  (
    {
      id,
      spinning = true,
      tip = "加载中...",
      size = "default",
      fullscreen = false,
      styles,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{
        minHeight: fullscreen ? 180 : 96,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin
        {...materials.Spin.mapProps(
          {
            spinning,
            tip,
            size: normalizeSpinSize(size),
            fullscreen,
            styles,
            ...props,
          },
          { mode: "preview" },
        )}
      >
        {fullscreen ? null : <div style={{ minHeight: 48, minWidth: 120 }} />}
      </Spin>
    </div>
  ),
);

const SpinEditorRenderer = forwardRef<HTMLDivElement, SpinProps>(
  (
    {
      id,
      spinning = true,
      tip = "加载中...",
      size = "default",
      fullscreen = false,
      styles,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{
        minHeight: fullscreen ? 180 : 96,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin
        {...materials.Spin.mapProps(
          {
            spinning,
            tip,
            size: normalizeSpinSize(size),
            fullscreen: false,
            styles,
            ...props,
          },
          { mode: "editor" },
        )}
      >
        <div
          style={{
            minHeight: 64,
            minWidth: 160,
            border: "1px dashed #d9d9d9",
            borderRadius: 8,
            background: "#fafafa",
          }}
        />
      </Spin>
    </div>
  ),
);

SpinRenderer.displayName = "SpinRenderer";
SpinEditorRenderer.displayName = "SpinEditorRenderer";

export default createLeafMaterial({
  name: "Spin",
  category: "feedback",
  desc: "加载中",
  defaultProps: {
    spinning: true,
    tip: "加载中...",
    size: "default",
    fullscreen: false,
  },
  allowedParents: [...SPIN_ALLOWED_PARENTS],
  setter: [
    field.switch("spinning", "加载中"),
    field.input("tip", "提示文案"),
    field.select("size", "尺寸", [
      { label: "小", value: "small" },
      { label: "默认", value: "default" },
      { label: "大", value: "large" },
    ]),
    field.switch("fullscreen", "全屏"),
  ],
  render: SpinRenderer,
  renderInEditor: SpinEditorRenderer,
});
