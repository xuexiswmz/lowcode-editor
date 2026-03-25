import ImageDev from "./dev";
import ImageProd from "./prod";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Image",
  category: "display",
  desc: "图片",
  defaultProps: {
    width: 220,
    height: 140,
    preview: false,
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "src",
      label: "图片地址",
      type: "input",
    },
    {
      name: "alt",
      label: "图片描述",
      type: "input",
    },
    {
      name: "height",
      label: "高度",
      type: "input",
    },
    {
      name: "width",
      label: "宽度",
      type: "input",
    },
    {
      name: "placeholder",
      label: "占位图",
      type: "input",
    },
    {
      name: "preview",
      label: "预览",
      type: "switch",
    },
    {
      name: "fallback",
      label: "加载失败图片",
      type: "input",
    },
    {
      name: "onError",
      label: "加载失败事件",
      type: "input",
    },
  ],
  dev: ImageDev,
  prod: ImageProd,
};

export default config;
