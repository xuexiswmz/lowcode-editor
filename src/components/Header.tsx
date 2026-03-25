import { memo } from "react";
import { useComponentsStore } from "../stores/components";

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
    <header className="lce-header">
      <div className="lce-brand">
        <img
          src="/LCE.svg"
          alt="logo"
          className="lce-logo"
          width={28}
          height={28}
        />
        <div>
          <div className="lce-title">低代码编辑器</div>
        </div>
      </div>
      <button
        onClick={handleModeToggle}
        className="lce-preview-btn"
        type="button"
      >
        {mode === "edit" ? "预览" : "退出预览"}
      </button>
    </header>
  );
});

export default Header;
