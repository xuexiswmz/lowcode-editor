import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../../interface";
import { Space as AntdSpace } from "antd";

const Space = ({ id, children, styles, name, align, orientation, size, separator, wrap }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(id);
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
  }, [drag, drop]);

  return (
    <div 
      ref={divRef}
      data-component-id={id}
      style={styles}
      className={`min-h-[120px] rounded-md border p-[20px] ${
        canDrop ? "border-blue-500 border-2" : "border-black border"
      }`}
    >
      <AntdSpace
        align={align}
        orientation={orientation}
        size={size}
        separator={separator}
        wrap={wrap}
      >
        {children}
      </AntdSpace>
    </div>
  );
};

export default Space;
