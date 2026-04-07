import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { DIVIDER_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Divider, materials } from "../ui";

const orientationOptions = [
  { label: "水平", value: "horizontal" },
  { label: "垂直", value: "vertical" },
];

const placementOptions = [
  { label: "居左", value: "start" },
  { label: "居中", value: "center" },
  { label: "居右", value: "end" },
];

const DividerRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    { id, styles, dashed, plain, orientation, titlePlacement, text = "分割线" },
    ref,
  ) => (
    <div ref={ref} data-component-id={id}>
      <Divider
        {...materials.Divider.mapProps(
          { styles, dashed, plain, orientation, titlePlacement },
          { mode: "preview" },
        )}
      >
        {text}
      </Divider>
    </div>
  ),
);

export default createLeafMaterial({
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
  allowedParents: [...DIVIDER_ALLOWED_PARENTS],
  setter: [
    field.switch("dashed", "虚线"),
    field.switch("plain", "普通正文样式"),
    field.select("orientation", "方向", orientationOptions),
    field.select("titlePlacement", "标题位置", placementOptions),
    field.input("text", "文案"),
  ],
  stylesSetter: [
    field.input("margin", "外边距"),
    field.input("width", "宽度"),
    field.input("borderTopWidth", "线宽"),
  ],
  render: DividerRenderer,
});
