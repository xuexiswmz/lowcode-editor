import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { TEXT_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";

const TextRenderer = forwardRef<HTMLSpanElement, CommonComponentProps>(
  ({ id, text = "文本", styles }, ref) => (
    <span ref={ref} data-component-id={id} style={styles}>
      {text}
    </span>
  ),
);

export default createLeafMaterial({
  name: "Text",
  category: "display",
  desc: "文本",
  defaultProps: {
    text: "文本",
  },
  allowedParents: [...TEXT_ALLOWED_PARENTS],
  setter: [field.input("text", "文本")],
  stylesSetter: [
    field.input("color", "文字颜色"),
    field.input("fontSize", "文字大小"),
  ],
  render: TextRenderer,
});
