import { useComponentsStore } from "../stores/components";
import { Button, Space } from "antd";

export default function Header() {
  const { mode, setMode, setCurComponentId } = useComponentsStore();
  return (
    <div className="w-[100%] h-[100%]">
      <div className="h-[50px] flex justify-between items-center px-[20px]">
        <div className="flex items-center gap-[10px]">
          <img src="/LCE.svg" alt="logo" className="w-[40px] h-[40px]" />
          <div className="text-[20px] font-bold">LowCodeEditor</div>
        </div>
        <Space>
          {mode === "edit" && (
            <Button
              onClick={() => {
                setMode("preview");
                setCurComponentId(null);
              }}
              type="primary"
            >
              Preview
            </Button>
          )}
          {mode === "preview" && (
            <Button
              onClick={() => {
                setMode("edit");
              }}
              type="primary"
            >
              Exit Preview
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}
