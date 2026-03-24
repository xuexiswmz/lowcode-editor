import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";
import { Image as AntdImage } from "antd";
import ImagePlaceholder from "./Placeholder";

export default function Image({
  id,
  name,
  styles,
  src,
  alt,
  fallback,
  height,
  width,
  placeholder,
  preview,
  onError,
}: CommonComponentProps) {
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });
  return (
    <div ref={drag} data-component-id={id}>
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
}
