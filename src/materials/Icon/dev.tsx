import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";
import { renderIcon } from "./shared";

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
      {renderIcon({
        source,
        iconName,
        localPath,
        size,
        spin,
        rotate,
      })}
    </div>
  );
}
