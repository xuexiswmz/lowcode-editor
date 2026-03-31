import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SURFACE_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { allIconOptions, IconRenderer, sourceOptions } from "./shared";

const IconMaterialRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, source, iconName, localPath, size, spin, rotate }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        ...styles,
      }}
    >
      <IconRenderer
        source={source}
        iconName={iconName}
        localPath={localPath}
        size={size}
        spin={spin}
        rotate={rotate}
      />
    </div>
  ),
);

export default createLeafMaterial({
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
    field.select("source", "资源来源", sourceOptions),
    field.select("iconName", "图标名称", allIconOptions),
    field.input("localPath", "本地路径"),
    field.inputNumber("size", "大小"),
    field.switch("spin", "旋转动画"),
    field.inputNumber("rotate", "旋转角度"),
  ],
  stylesSetter: [
    field.input("color", "颜色"),
    field.input("margin", "外边距"),
  ],
  events: [],
  methods: [],
  render: IconMaterialRenderer,
});
