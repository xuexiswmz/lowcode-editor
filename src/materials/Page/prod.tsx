import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";

const Page = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ children, styles }, ref) => {
    return (
      <div
        ref={ref}
        className="p-[20px] box-border rounded-md"
        style={{ ...styles }}
      >
        {children}
      </div>
    );
  }
);

export default Page;
