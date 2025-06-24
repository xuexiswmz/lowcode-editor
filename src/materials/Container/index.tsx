import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../../interface";

const Container = ({ id, children }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(["Button", "Container"], id);

  return (
    <div
      ref={drop}
      className={`min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px] ${
        canDrop ? "border-2 border-blue" : "border-[1px] border-[#000]"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
