import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";

const Container = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ children, styles }, ref) => {
    return (
      <div
        ref={ref}
        style={styles}
        className={`min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px]`}
      >
        {children}
      </div>
    );
  }
);

export default Container;
