import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SURFACE_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import { Space, materials } from "../ui";

const alignOptions = [
  { label: "start", value: "start" },
  { label: "end", value: "end" },
  { label: "center", value: "center" },
  { label: "baseline", value: "baseline" },
];

const orientationOptions = [
  { label: "水平", value: "horizontal" },
  { label: "垂直", value: "vertical" },
];

const sizeOptions = [
  { label: "小", value: "small" },
  { label: "中", value: "middle" },
  { label: "大", value: "large" },
];

const SpaceRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, align, orientation, size, separator, wrap }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={styles}
      className="min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px]"
    >
      <Space
        {...materials.Space.mapProps(
          { align, orientation, size, separator, wrap },
          { mode: "preview" },
        )}
      >
        {children}
      </Space>
    </div>
  ),
);

const SpaceEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, align, orientation, size, separator, wrap }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={styles}
      className="min-h-[120px] rounded-md border border-black p-[20px]"
    >
      <Space
        {...materials.Space.mapProps(
          { align, orientation, size, separator, wrap },
          { mode: "editor" },
        )}
      >
        {children}
      </Space>
    </div>
  ),
);

export default createContainerMaterial({
  name: "Space",
  category: "layout",
  desc: "间距",
  defaultProps: {},
  allowedParents: SURFACE_PARENTS,
  isContainer: true,
  setter: [
    field.select("align", "对齐方式", alignOptions),
    field.select("orientation", "方向", orientationOptions),
    field.select("size", "间距大小", sizeOptions),
    field.input("separator", "分割符"),
    field.switch("wrap", "自动换行"),
  ],
  stylesSetter: [],
  events: [],
  methods: [],
  render: SpaceRenderer,
  renderInEditor: SpaceEditorRenderer,
});
