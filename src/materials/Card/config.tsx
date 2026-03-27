import { lazy } from "react";
import type { ComponentConfig } from "../types";

const CardDev = lazy(() => import("./dev"));
const CardProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Card",
  category: "display",
  desc: "卡片",
  defaultProps: {
    title: "Card Title",
    hoverable: false,
    loading: false,
    size: "medium",
    variant: "outlined",
    cover: "",
  },
  allowedParents: ["Page", "Container", "Modal"],
  isContainer: true,
  setter: [
    {
      name: "title",
      label: "标题",
      type: "input",
    },
    {
      name: "cover",
      label: "封面",
      type: "image",
    },
    {
      name: "hoverable",
      label: "可悬浮",
      type: "switch",
    },
    {
      name: "loading",
      label: "加载中",
      type: "switch",
    },
    {
      name: "size",
      label: "尺寸",
      type: "select",
      options: [
        { label: "默认", value: "medium" },
        { label: "小", value: "small" },
      ],
    },
    {
      name: "variant",
      label: "风格",
      type: "select",
      options: [
        { label: "边框", value: "outlined" },
        { label: "无边框", value: "borderless" },
      ],
    }
  ],
  stylesSetter: [
    {
      name: "width",
      label: "宽度",
      type: "input",
    },
    {
      name: "height",
      label: "高度",
      type: "input",
    }
  ],
  events: [],
  methods: [],
  dev: CardDev,
  prod: CardProd,
};

export default config;
