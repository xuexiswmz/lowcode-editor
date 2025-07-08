import type { CommonComponentProps } from "../../interface";

const Container = ({ children, styles }: CommonComponentProps) => {
  return (
    <div
      style={styles}
      className={`min-h-[100px] p-[20px] rounded-md mt-[10px] mb-[10px] 
      `}
    >
      {children}
    </div>
  );
};

export default Container;
