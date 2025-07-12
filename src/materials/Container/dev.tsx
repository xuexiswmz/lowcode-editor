import { useEffect, useRef } from "react";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";

const Container = ({ id, children, styles, name }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(["Button", "Container"], id);
  const divRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      data-component-id={id}
      ref={divRef}
      style={styles}
      className={`min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px] ${
        canDrop ? "border-2 border-blue" : "border-[1px] border-[#000]"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
