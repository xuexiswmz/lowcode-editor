import IconDev from "./dev";
import IconProd from "./prod";
import { allIconOptions, sourceOptions } from "./shared";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Icon",
  category: "common",
  desc: "图标",
  defaultProps: {
    source: "antd",
    iconName: "HomeOutlined",
    localPath: "",
    size: 16,
    spin: false,
    rotate: 0,
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "source",
      label: "资源来源",
      type: "select",
      options: sourceOptions,
    },
    {
      name: "iconName",
      label: "图标名称",
      type: "select",
      options: allIconOptions,
    },
    {
      name: "localPath",
      label: "本地路径",
      type: "input",
    },
    {
      name: "size",
      label: "大小",
      type: "inputNumber",
    },
    {
      name: "spin",
      label: "旋转动画",
      type: "switch",
    },
    {
      name: "rotate",
      label: "旋转角度",
      type: "inputNumber",
    },
  ],
  stylesSetter: [
    {
      name: "color",
      label: "颜色",
      type: "input",
    },
    {
      name: "margin",
      label: "外边距",
      type: "input",
    },
  ],
  events: [],
  methods: [],
  dev: IconDev,
  prod: IconProd,
};

export default config;
