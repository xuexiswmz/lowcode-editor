import type { CommonComponentProps } from "../../interface";

function Page({ children, styles }: CommonComponentProps) {
  return (
    <div className="p-[20px] box-border rounded-md" style={{ ...styles }}>
      {children}
    </div>
  );
}

export default Page;
