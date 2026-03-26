import { useDrag } from "react-dnd";
import { useComponentsStore } from "../../stores/components";
import type { CommonComponentProps } from "../../interface";
import { LinkRenderer } from "./shared";

export default function Link({
  id,
  name,
  styles,
  text = "链接",
  href,
  target,
  underline = true,
  disabled = false,
}: CommonComponentProps) {
  const { mode } = useComponentsStore();
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  const isEditMode = mode === "edit";

  return (
    <div ref={drag} data-component-id={id}>
      <LinkRenderer
        href={href}
        target={target}
        text={text}
        underline={underline}
        disabled={disabled}
        styles={styles}
        onClick={
          disabled || isEditMode
            ? (e) => {
                e.preventDefault();
                if (disabled) {
                  e.stopPropagation();
                }
              }
            : undefined
        }
      />
    </div>
  );
}
