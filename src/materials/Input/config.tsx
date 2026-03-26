import { lazy } from "react";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const InputDev = lazy(() => import("./dev"));
const InputProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Input",
  category: "form",
  desc: "输入框",
  defaultProps: {
    value: "",
    placeholder: "请输入内容",
    disabled: false,
    maxLength: 10,
    type: "text",
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "value",
      label: "值",
      type: "input",
    },
    {
      name: "placeholder",
      label: "占位符",
      type: "input",
    },
    {
      name: "disabled",
      label: "禁用",
      type: "switch",
    },
    {
      name: "maxLength",
      label: "最大长度",
      type: "inputNumber",
    },
    {
      name: "type",
      label: "类型",
      type: "select",
      options: [
        { label: "文本", value: "text" },
        { label: "密码", value: "password" },
        { label: "数字", value: "number" },
        { label: "邮箱", value: "email" },
        { label: "电话", value: "tel" },
        { label: "搜索", value: "search" },
        { label: "网址", value: "url" },
      ],
    },
  ],
  events: [
    {
      name: "onChange",
      label: "值变化事件",
    },
    {
      name: "onFocus",
      label: "聚焦事件",
    },
    {
      name: "onBlur",
      label: "失焦事件",
    },
  ],
  dev: InputDev,
  prod: InputProd,
};

export default config;
