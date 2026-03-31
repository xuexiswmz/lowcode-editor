import { Button as AntdButton } from "antd";
import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { SURFACE_PARENTS } from "../constants";

const buttonTypeOptions = [
  { label: "主按钮", value: "primary" },
  { label: "次按钮", value: "default" },
  { label: "虚线按钮", value: "dashed" },
  { label: "文本按钮", value: "text" },
  { label: "链接按钮", value: "link" },
];

const buttonSizeOptions = [
  { label: "大", value: "large" },
  { label: "中", value: "middle" },
  { label: "小", value: "small" },
];

const ButtonRenderer = forwardRef<HTMLButtonElement, CommonComponentProps>(
  (
    {
      id,
      type,
      text,
      styles,
      size = "middle",
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => (
    <AntdButton
      ref={ref}
      type={type}
      size={size}
      disabled={disabled}
      loading={loading}
      style={styles}
      {...props}
      id={id?.toString()}
    >
      {text}
    </AntdButton>
  ),
);

const ButtonEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      type,
      text,
      styles,
      size = "middle",
      disabled = false,
      loading = false,
    },
    ref,
  ) => (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
      ref={ref}
      data-component-id={id}
    >
      <AntdButton
        type={type}
        size={size}
        disabled={disabled}
        loading={loading}
        style={styles}
      >
        {text}
      </AntdButton>
      {disabled ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            cursor: "pointer",
          }}
          data-component-id={id}
        />
      ) : null}
    </div>
  ),
);

export default createLeafMaterial({
  name: "Button",
  category: "common",
  desc: "按钮",
  defaultProps: {
    type: "primary",
    text: "按钮",
    size: "middle",
    disabled: false,
    loading: false,
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    field.select("type", "类型", buttonTypeOptions),
    field.input("text", "文本"),
    field.select("size", "大小", buttonSizeOptions),
    field.switch("disabled", "禁用"),
    field.switch("loading", "加载中"),
  ],
  stylesSetter: [
    field.input("margin", "外边距"),
    field.input("padding", "内边距"),
    field.inputNumber("borderRadius", "圆角"),
  ],
  events: [
    { name: "onClick", label: "点击事件" },
    { name: "onDoubleClick", label: "双击事件" },
    { name: "onMouseEnter", label: "鼠标进入" },
    { name: "onMouseLeave", label: "鼠标离开" },
  ],
  render: ButtonRenderer,
  renderInEditor: ButtonEditorRenderer,
});
