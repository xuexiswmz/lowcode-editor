import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { CONTAINER_ALLOWED_PARENTS } from "../constants";
import { createContainerMaterial } from "../factories";

const ContainerRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles }, ref) => (
    <div
      data-component-id={id}
      ref={ref}
      style={styles}
      className="min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px]"
    >
      {children}
    </div>
  ),
);

const ContainerEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles }, ref) => (
    <div
      data-component-id={id}
      ref={ref}
      style={styles}
      className="min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px] border-[1px] border-[#000]"
    >
      {children}
    </div>
  ),
);

export default createContainerMaterial({
  name: "Container",
  category: "layout",
  desc: "容器",
  defaultProps: {},
  isContainer: true,
  allowedParents: [...CONTAINER_ALLOWED_PARENTS],
  render: ContainerRenderer,
  renderInEditor: ContainerEditorRenderer,
});
