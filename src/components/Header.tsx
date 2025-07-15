import { useComponentsStore } from "../stores/components";
import { memo } from "react";

// 使用memo优化组件渲染
const Header = memo(function Header() {
  const { mode, setMode, setCurComponentId } = useComponentsStore();

  const handleModeToggle = () => {
    if (mode === "edit") {
      setMode("preview");
      setCurComponentId(null);
    } else {
      setMode("edit");
    }
  };

  return (
    <div className="w-[100%] h-[100%]">
      <div className="h-[50px] flex justify-between items-center px-[20px]">
        <div className="flex items-center gap-[10px]">
          <img
            src="/LCE.svg"
            alt="logo"
            className="w-[40px] h-[40px]"
            width={40}
            height={40}
          />
          <div className="text-[20px] font-bold">LowCodeEditor</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleModeToggle}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded transition-colors"
          >
            {mode === "edit" ? "Preview" : "Exit Preview"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default Header;
