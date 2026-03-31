import { Card as AntCard } from "antd";
import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import { resolveCardCover } from "./shared";

const cardSizeOptions = [
  { label: "默认", value: "medium" },
  { label: "小", value: "small" },
];

const cardVariantOptions = [
  { label: "边框", value: "outlined" },
  { label: "无边框", value: "borderless" },
];

const CardRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      children,
      styles,
      title,
      cover,
      hoverable,
      loading,
      size,
      variant,
    },
    ref,
  ) => (
    <div ref={ref} data-component-id={id} style={styles}>
      <AntCard
        title={title}
        cover={resolveCardCover(cover, title)}
        hoverable={hoverable}
        loading={loading}
        size={size}
        variant={variant}
      >
        {children}
      </AntCard>
    </div>
  ),
);

export default createContainerMaterial({
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
    field.input("title", "标题"),
    field.image("cover", "封面"),
    field.switch("hoverable", "可悬浮"),
    field.switch("loading", "加载中"),
    field.select("size", "尺寸", cardSizeOptions),
    field.select("variant", "风格", cardVariantOptions),
  ],
  stylesSetter: [
    field.input("width", "宽度"),
    field.input("height", "高度"),
  ],
  events: [],
  methods: [],
  render: CardRenderer,
});
