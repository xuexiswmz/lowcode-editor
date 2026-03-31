import { Image as AntdImage } from "antd";
import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SURFACE_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import ImagePlaceholder from "./Placeholder";

const ImageRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      styles,
      src,
      alt,
      fallback,
      height,
      width,
      placeholder,
      preview,
      onError,
    },
    ref,
  ) => (
    <div ref={ref} data-component-id={id}>
      {src ? (
        <AntdImage
          style={styles}
          src={src}
          alt={alt}
          fallback={fallback}
          height={height}
          width={width}
          placeholder={placeholder}
          preview={preview}
          onError={onError}
        />
      ) : (
        <ImagePlaceholder width={width} height={height} styles={styles} />
      )}
    </div>
  ),
);

export default createLeafMaterial({
  name: "Image",
  category: "display",
  desc: "图片",
  defaultProps: {
    width: 220,
    height: 140,
    preview: false,
  },
  allowedParents: SURFACE_PARENTS,
  setter: [
    field.input("src", "图片地址"),
    field.input("alt", "图片描述"),
    field.input("height", "高度"),
    field.input("width", "宽度"),
    field.input("placeholder", "占位图"),
    field.switch("preview", "预览"),
    field.input("fallback", "加载失败图片"),
    field.input("onError", "加载失败事件"),
  ],
  render: ImageRenderer,
});
