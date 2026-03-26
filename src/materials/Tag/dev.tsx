import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";
import { TagRenderer } from "./shared";

export default function Tag({
  id,
  name,
  styles,
  text,
  color,
  disabled,
  target,
  href,
  icon,
  variant,
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
      <TagRenderer
        color={color}
        disabled={disabled}
        target={target}
        href={href}
        icon={icon}
        variant={variant}
        styles={styles}
        text = {text}
      />
    </div>
  );
}
