import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { createContainerMaterial } from "../factories";

const PageRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles }, ref) => (
    <div
      data-component-id={id}
      ref={ref}
      className="p-[20px] box-border rounded-md"
      style={{ ...styles }}
    >
      {children}
    </div>
  ),
);

const PageEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles }, ref) => (
    <div
      data-component-id={id}
      ref={ref}
      className="p-[20px] h-[100%] box-border rounded-md"
      style={{ ...styles }}
    >
      {children}
    </div>
  ),
);

export default createContainerMaterial({
  name: "Page",
  category: "layout",
  desc: "页面",
  defaultProps: {},
  isContainer: true,
  render: PageRenderer,
  renderInEditor: PageEditorRenderer,
});
