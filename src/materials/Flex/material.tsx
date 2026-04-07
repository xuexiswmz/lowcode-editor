import type { CSSProperties } from "react";
import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { FLEX_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import { Flex, materials } from "../ui";

type FlexMaterialProps = CommonComponentProps & {
  vertical?: boolean;
  wrap?: boolean | CSSProperties["flexWrap"];
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  gap?: CSSProperties["gap"] | "small" | "middle" | "large";
  flex?: CSSProperties["flex"];
};

const justifyOptions = [
  { label: "从起点开始", value: "flex-start" },
  { label: "居中", value: "center" },
  { label: "靠末尾", value: "flex-end" },
  { label: "两端对齐", value: "space-between" },
  { label: "两侧留白", value: "space-around" },
  { label: "均匀分布", value: "space-evenly" },
];

const alignOptions = [
  { label: "顶部对齐", value: "flex-start" },
  { label: "居中对齐", value: "center" },
  { label: "底部对齐", value: "flex-end" },
  { label: "拉伸", value: "stretch" },
  { label: "基线对齐", value: "baseline" },
];

const gapOptions = [
  { label: "小", value: "small" },
  { label: "中", value: "middle" },
  { label: "大", value: "large" },
];

const wrapOptions = [
  { label: "不换行", value: "nowrap" },
  { label: "换行", value: "wrap" },
  { label: "反向换行", value: "wrap-reverse" },
];

const FlexRenderer = forwardRef<HTMLDivElement, FlexMaterialProps>(
  ({ id, children, styles, vertical, wrap, justify, align, flex, gap }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      <Flex
        {...materials.Flex.mapProps(
          { vertical, wrap, justify, align, flex, gap },
          { mode: "preview" },
        )}
        className="min-h-[100px] rounded-md p-[20px]"
      >
        {children}
      </Flex>
    </div>
  ),
);

const FlexEditorRenderer = forwardRef<HTMLDivElement, FlexMaterialProps>(
  ({ id, children, styles, vertical, wrap, justify, align, flex, gap }, ref) => (
    <div ref={ref} data-component-id={id} style={styles} className="min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px] border-[1px] border-[#000]">
      <Flex
        {...materials.Flex.mapProps(
          { vertical, wrap, justify, align, flex, gap },
          { mode: "editor" },
        )}
        className="min-h-[60px] w-full"
      >
        {children}
      </Flex>
    </div>
  ),
);

export default createContainerMaterial({
  name: "Flex",
  category: "layout",
  desc: "弹性布局",
  defaultProps: {
    vertical: false,
    wrap: false,
    justify: "flex-start",
    align: "flex-start",
    gap: "small",
  },
  allowedParents: [...FLEX_ALLOWED_PARENTS],
  isContainer: true,
  setter: [
    field.switch("vertical", "垂直"),
    field.select("justify", "主轴对齐", justifyOptions),
    field.select("align", "交叉轴对齐", alignOptions),
    field.select("gap", "间距", gapOptions),
    field.select("wrap", "换行方式", wrapOptions),
  ],
  stylesSetter: [
    field.input("width", "宽度"),
    field.input("minHeight", "最小高度"),
  ],
  events: [],
  methods: [],
  render: FlexRenderer,
  renderInEditor: FlexEditorRenderer,
});
