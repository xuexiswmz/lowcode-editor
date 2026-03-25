import DividerDev from "./dev";
import DividerProd from "./prod";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Divider",
  category: "layout",
  desc: "分割线",
  defaultProps: {
    dashed: false,
    plain: false,
    orientation: "horizontal",
    titlePlacement: "center",
    text: "分割线",
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "dashed",
      label: "虚线",
      type: "switch",
    },
    {
      name: "plain",
      label: "普通正文样式",
      type: "switch",
    },
    {
      name: "orientation",
      label: "方向",
      type: "select",
      options: [
        { label: "水平", value: "horizontal" },
        { label: "垂直", value: "vertical" },
      ],
    },
    {
      name: "titlePlacement",
      label: "标题位置",
      type: "select",
      options: [
        { label: "居左", value: "start" },
        { label: "居中", value: "center" },
        { label: "居右", value: "end" },
      ],
    },
    {
      name: "text",
      label: "文案",
      type: "input",
    },
  ],
  stylesSetter: [
    {
      name: "margin",
      label: "外边距",
      type: "input",
    },
    {
      name: "width",
      label: "宽度",
      type: "input",
    },
    {
      name: "borderTopWidth",
      label: "线宽",
      type: "input",
    },
  ],
  dev: DividerDev,
  prod: DividerProd,
};

export default config;
