import { lazy } from "react";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const TextDev = lazy(() => import("./dev"));
const TextProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Text",
  category: "display",
  desc: "文本",
  defaultProps: {
    text: "文本",
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "text",
      label: "文本",
      type: "input",
    },
  ],
  stylesSetter: [
    {
      name: "color",
      label: "文字颜色",
      type: "color",
    },
    {
      name: "fontSize",
      label: "文字大小",
      type: "input",
    },
  ],
  dev: TextDev,
  prod: TextProd,
};

export default config;
