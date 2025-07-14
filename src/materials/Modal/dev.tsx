import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../../interface";

function Modal({ id, children, title, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(
    ["Button", "Container", "Input"],
    id
  );
  return (
    <div
      ref={drop}
      style={styles}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] ${
        canDrop
          ? "border-[2px] border-[blue] rounded-md"
          : "border-[1px] border-[#000] rounded-md"
      }`}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}
export default Modal;
