import { lazy } from "react";
import type { ComponentConfig } from "../types";
import { SURFACE_PARENTS } from "../constants";

const SpaceDev = lazy(() => import("./dev"));
const SpaceProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Space",
  category: "layout",
  desc: "间距",
  defaultProps: {},
  allowedParents: SURFACE_PARENTS,
  isContainer: true,
  setter: [
    {
      name: "align",
      label: "对齐方式",
      type: "select",
      options: [
        { label: "start", value: "start" },
        { label: "end", value: "end" },
        { label: "center", value: "center" },
        { label: "baseline", value: "baseline" },
      ],
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
      name: "size",
      label: "间距大小",
      type: "select",
      options: [
        { label: "小", value: "small" },
        { label: "中", value: "middle" },
        { label: "大", value: "large" },
      ],
    },
    {
      name: "separator",
      label: "分割符",
      type: "input",
    },
    {
      name: "wrap",
      label: "自动换行",
      type: "switch",
    },
  ],
  stylesSetter: [],
  events: [],
  methods: [],
  dev: SpaceDev,
  prod: SpaceProd,
};

export default config;
