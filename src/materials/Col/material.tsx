import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { COL_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import { Col, materials } from "../ui";

const ColRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, span = 8, offset = 0, order, flex }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      <Col
        {...materials.Col.mapProps(
          { span, offset, order, flex },
          { mode: "preview" },
        )}
      >
        <div className="min-h-[100px] rounded-md p-[20px]">{children}</div>
      </Col>
    </div>
  ),
);

const ColEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, span = 8, offset = 0, order, flex }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      <Col
        {...materials.Col.mapProps(
          { span, offset, order, flex },
          { mode: "editor" },
        )}
      >
        <div className="min-h-[100px] rounded-md border border-dashed border-black p-[20px]">
          {children}
        </div>
      </Col>
    </div>
  ),
);

export default createContainerMaterial({
  name: "Col",
  category: "layout",
  desc: "栅格列",
  defaultProps: {
    span: 8,
    offset: 0,
  },
  allowedParents: [...COL_ALLOWED_PARENTS],
  isContainer: true,
  setter: [
    field.inputNumber("span", "栅格宽度"),
    field.inputNumber("offset", "偏移"),
    field.inputNumber("order", "排序"),
    field.input("flex", "弹性布局"),
  ],
  stylesSetter: [
    field.input("width", "宽度"),
    field.input("minHeight", "最小高度"),
  ],
  events: [],
  methods: [],
  render: ColRenderer,
  renderInEditor: ColEditorRenderer,
});
