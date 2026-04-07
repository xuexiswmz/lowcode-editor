import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { TAG_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { allIconOptions } from "../Icon/shared";
import { TagRenderer } from "./shared";

const tagColorOptions = [
  { label: "默认", value: "default" },
  { label: "成功", value: "success" },
  { label: "警告", value: "warning" },
  { label: "错误", value: "error" },
  { label: "加载中", value: "processing" },
];

const tagTargetOptions = [
  { label: "当前窗口", value: "_self" },
  { label: "新窗口", value: "_blank" },
];

const tagVariantOptions = [
  { label: "填充", value: "filled" },
  { label: "实心", value: "solid" },
  { label: "描边", value: "outlined" },
];

const TagMaterialRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, text, color, disabled, target, href, icon, variant }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{ display: "inline-block", width: "fit-content" }}
    >
      <TagRenderer
        color={color}
        disabled={disabled}
        target={target}
        href={href}
        icon={icon}
        variant={variant}
        styles={styles}
        text={text}
      />
    </div>
  ),
);

export default createLeafMaterial({
  name: "Tag",
  category: "display",
  desc: "标签",
  defaultProps: {
    text: "Tag",
    color: "default",
    disabled: false,
    variant: "filled",
  },
  allowedParents: [...TAG_ALLOWED_PARENTS],
  setter: [
    field.input("text", "标签内容"),
    field.select("color", "状态颜色", tagColorOptions),
    field.switch("disabled", "禁用"),
    field.select("target", "链接打开方式", tagTargetOptions),
    field.input("href", "链接地址"),
    field.select("icon", "图标", allIconOptions),
    field.select("variant", "风格", tagVariantOptions),
  ],
  stylesSetter: [
    field.input("margin", "外边距"),
    field.input("padding", "内边距"),
    field.input("fontSize", "字体大小"),
  ],
  events: [],
  methods: [],
  render: TagMaterialRenderer,
});
