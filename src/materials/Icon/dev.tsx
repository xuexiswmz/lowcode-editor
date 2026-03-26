import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";
import { IconRenderer } from "./shared";

export default function Icon({
  id,
  name,
  styles,
  source,
  iconName,
  localPath,
  size,
  spin,
  rotate,
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        ...styles,
      }}
    >
      <IconRenderer
        source={source}
        iconName={iconName}
        localPath={localPath}
        size={size}
        spin={spin}
        rotate={rotate}
      />
    </div>
  );
}
