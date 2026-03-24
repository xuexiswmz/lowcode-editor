import type { CommonComponentProps } from "../../interface";
import { Image as AntdImage } from "antd";
import { forwardRef } from "react";
import ImagePlaceholder from "./Placeholder";

const Image = forwardRef<HTMLDivElement, CommonComponentProps>(
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
  ) => {
    return (
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
    );
  },
);
export default Image;
