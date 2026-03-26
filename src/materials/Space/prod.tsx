import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { Space as AntdSpace } from "antd";

const Space = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles, align, orientation, size, separator, wrap }, ref) => {
    return (
      <div ref={ref} data-component-id={id} style={styles}
        className={`min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px]`}
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
  },
);

export default Space;
