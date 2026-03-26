import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";
import { AvatarRenderer } from "./shared";

export default function Avatar({
  id,
  name,
  styles,
  alt,
  gap,
  icon,
  shape,
  size,
  src,
  text,
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
    <div
      ref={drag}
      data-component-id={id}
      style={{ display: "inline-block", width: "fit-content" }}
    >
      <AvatarRenderer
        alt={alt}
        gap={gap}
        icon={icon}
        shape={shape}
        size={size}
        src={src}
        styles={styles}
        text={text}
      />
    </div>
  );
}
