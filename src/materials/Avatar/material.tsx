import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SURFACE_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { allIconOptions } from "../Icon/shared";
import { AvatarRenderer } from "./shared";

const avatarShapeOptions = [
  { label: "圆形", value: "circle" },
  { label: "方形", value: "square" },
];

const avatarSizeOptions = [
  { label: "小", value: "small" },
  { label: "中", value: "medium" },
  { label: "大", value: "large" },
];

const AvatarMaterialRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, alt, gap, icon, shape, size, src, text }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{ display: "inline-block", width: "fit-content" }}
    >
      <AvatarRenderer
        alt={alt}
        gap={gap}
        icon={icon}
        shape={shape}
        size={size}
        src={src}
        styles={styles}
        text={text}
      />
    </div>
  ),
);

export default createLeafMaterial({
  name: "Avatar",
  category: "display",
  desc: "头像",
  defaultProps: {
    alt: "",
    gap: 4,
    shape: "circle",
    size: "medium",
    text: "A",
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    field.input("src", "图片地址"),
    field.input("alt", "替代文本"),
    field.input("gap", "间距"),
    field.select("icon", "图标", allIconOptions),
    field.select("shape", "形状", avatarShapeOptions),
    field.select("size", "大小", avatarSizeOptions),
    field.input("text", "头像内容"),
  ],
  stylesSetter: [],
  events: [],
  methods: [],
  render: AvatarMaterialRenderer,
});
