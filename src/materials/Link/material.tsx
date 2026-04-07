import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { LINK_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { LinkRenderer } from "./shared";

const targetOptions = [
  { label: "当前窗口", value: "_self" },
  { label: "新窗口", value: "_blank" },
];

const LinkRendererProd = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      styles,
      text = "Link",
      href,
      target,
      underline = true,
      disabled = false,
    },
    ref,
  ) => (
    <div ref={ref} data-component-id={id}>
      <LinkRenderer
        href={href}
        target={target}
        text={text}
        underline={underline}
        disabled={disabled}
        styles={styles}
        onClick={
          disabled
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            : undefined
        }
      />
    </div>
  ),
);

const LinkRendererEditor = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      styles,
      text = "链接",
      href,
      target,
      underline = true,
      disabled = false,
    },
    ref,
  ) => (
    <div ref={ref} data-component-id={id}>
      <LinkRenderer
        href={href}
        target={target}
        text={text}
        underline={underline}
        disabled={disabled}
        styles={styles}
        onClick={(e) => {
          e.preventDefault();
          if (disabled) {
            e.stopPropagation();
          }
        }}
      />
    </div>
  ),
);

export default createLeafMaterial({
  name: "Link",
  category: "navigation",
  desc: "链接",
  defaultProps: {
    text: "Link",
    underline: true,
    disabled: false,
  },
  allowedParents: [...LINK_ALLOWED_PARENTS],
  setter: [
    field.input("href", "链接地址"),
    field.select("target", "打开方式", targetOptions),
    field.input("text", "链接文本"),
    field.switch("underline", "下划线"),
    field.switch("disabled", "禁用"),
  ],
  stylesSetter: [],
  events: [],
  methods: [],
  render: LinkRendererProd,
  renderInEditor: LinkRendererEditor,
});
