import ButtonDev from "./dev";
import ButtonProd from "./prod";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Button",
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
    {
      name: "type",
      label: "类型",
      type: "select",
      options: [
        { label: "主按钮", value: "primary" },
        { label: "次按钮", value: "default" },
        { label: "虚线按钮", value: "dashed" },
        { label: "文本按钮", value: "text" },
        { label: "链接按钮", value: "link" },
      ],
    },
    {
      name: "text",
      label: "文本",
      type: "input",
    },
    {
      name: "size",
      label: "大小",
      type: "select",
      options: [
        { label: "大", value: "large" },
        { label: "中", value: "middle" },
        { label: "小", value: "small" },
      ],
    },
    {
      name: "disabled",
      label: "禁用",
      type: "switch",
    },
    {
      name: "loading",
      label: "加载中",
      type: "switch",
    },
  ],
  stylesSetter: [
    {
      name: "margin",
      label: "外边距",
      type: "input",
    },
    {
      name: "padding",
      label: "内边距",
      type: "input",
    },
    {
      name: "borderRadius",
      label: "圆角",
      type: "inputNumber",
    },
  ],
  events: [
    {
      name: "onClick",
      label: "点击事件",
    },
    {
      name: "onDoubleClick",
      label: "双击事件",
    },
    {
      name: "onMouseEnter",
      label: "鼠标进入",
    },
    {
      name: "onMouseLeave",
      label: "鼠标离开",
    },
  ],
  dev: ButtonDev,
  prod: ButtonProd,
};

export default config;
