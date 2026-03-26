import { lazy } from "react";
import type { ComponentConfig } from "../types";
import { allIconOptions } from "../Icon/shared";
import { SURFACE_PARENTS } from "../constants";

const TagDev = lazy(() => import("./dev"));
const TagProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Tag",
  category: "display",
  desc: "标签",
  defaultProps: {
    text: "Tag",
    color: "default",
    disabled: false,
    variant: "filled",
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "text",
      type: "input",
      label: "标签内容",
    },
    {
      name: "color",
      type: "select",
      label: "状态颜色",
      options: [
        { label: "默认", value: "default" },
        { label: "成功", value: "success" },
        { label: "警告", value: "warning" },
        { label: "错误", value: "error" },
        { label: "加载中", value: "processing" },
      ],
    },
    {
      name: "disabled",
      type: "switch",
      label: "禁用",
    },
    {
      name: "target",
      type: "select",
      label: "链接打开方式",
      options: [
        { label: "当前窗口", value: "_self" },
        { label: "新窗口", value: "_blank" },
      ],
    },
    {
      name: "href",
      type: "input",
      label: "链接地址",
    },
    {
      name: "icon",
      type: "select",
      label: "图标",
      options: allIconOptions
    },
    {
      name: "variant",
      type: "select",
      label: "风格",
      options: [
        { label: "填充", value: "filled" },
        { label: "实心", value: "solid" },
        { label: "描边", value: "outlined" },
      ],

    },
  ],
  stylesSetter: [
    {
      name: "margin",
      type: "input",
      label: "外边距",
    },
    {
      name: "padding",
      type: "input",
      label: "内边距",
    },
    {
      name: "fontSize",
      type: "input",
      label: "字体大小",
    }
  ],
  events: [],
  methods: [],
  dev: TagDev,
  prod: TagProd,
};

export default config;
