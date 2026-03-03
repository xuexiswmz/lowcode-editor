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
        <img src="/LCE.svg" alt="logo" className="lce-logo" width={40} height={40} />
        <div className="lce-title">LowCodeEditor</div>
      </div>
      <button onClick={handleModeToggle} className="lce-preview-btn" type="button">
        {mode === "edit" ? "Preview" : "Exit Preview"}
      </button>
    </header>
  );
});

export default Header;
