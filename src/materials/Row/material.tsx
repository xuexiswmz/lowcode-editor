import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { ROW_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import { Row, materials } from "../ui";

const justifyOptions = [
  { label: "起点对齐", value: "start" },
  { label: "居中", value: "center" },
  { label: "末尾对齐", value: "end" },
  { label: "两端对齐", value: "space-between" },
  { label: "环绕分布", value: "space-around" },
  { label: "均匀分布", value: "space-evenly" },
];

const alignOptions = [
  { label: "顶部", value: "top" },
  { label: "中间", value: "middle" },
  { label: "底部", value: "bottom" },
  { label: "拉伸", value: "stretch" },
];

const RowRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, gutter, justify, align, wrap = true }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      <Row
        {...materials.Row.mapProps(
          { gutter, justify, align, wrap },
          { mode: "preview" },
        )}
        className="min-h-[100px] rounded-md p-[20px]"
      >
        {children}
      </Row>
    </div>
  ),
);

const RowEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, gutter, justify, align, wrap = true }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={styles}
      className="min-h-[100px] rounded-md border border-black p-[20px]"
    >
      <Row
        {...materials.Row.mapProps(
          { gutter, justify, align, wrap },
          { mode: "editor" },
        )}
        className="min-h-[60px] w-full"
      >
        {children}
      </Row>
    </div>
  ),
);

export default createContainerMaterial({
  name: "Row",
  category: "layout",
  desc: "栅格行",
  defaultProps: {
    gutter: 16,
    justify: "start",
    align: "top",
    wrap: true,
  },
  allowedParents: [...ROW_ALLOWED_PARENTS],
  isContainer: true,
  setter: [
    field.inputNumber("gutter", "栅格间距"),
    field.select("justify", "主轴对齐", justifyOptions),
    field.select("align", "交叉轴对齐", alignOptions),
    field.switch("wrap", "自动换行"),
  ],
  stylesSetter: [
    field.input("width", "宽度"),
    field.input("minHeight", "最小高度"),
  ],
  events: [],
  methods: [],
  render: RowRenderer,
  renderInEditor: RowEditorRenderer,
});
