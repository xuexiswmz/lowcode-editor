import { lazy } from "react";
import type { ComponentConfig } from "../types";

const LinkDev = lazy(() => import("./dev"));
const LinkProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Link",
  category: "navigation",
  desc: "链接",
  defaultProps: {
    text: "Link",
    underline: true,
    disabled: false,
  },
  allowedParents: ["Page", "Container", "Modal"],
  setter: [
    {
      name: "href",
      label: "链接地址",
      type: "input",
    },
    {
      name: "target",
      label: "打开方式",
      type: "select",
      options: [
        { label: "当前窗口", value: "_self" },
        { label: "新窗口", value: "_blank" },
      ],
    },
    {
      name: "text",
      label: "链接文本",
      type: "input",
    },
    {
      name: "underline",
      label: "下划线",
      type: "switch",
    },
    {
      name: "disabled",
      label: "禁用",
      type: "switch",
    },
  ],
  stylesSetter: [],
  events: [],
  methods: [],
  dev: LinkDev,
  prod: LinkProd,
};

export default config;
