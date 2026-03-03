import { Segmented } from "antd";
import { useState } from "react";
import { useComponentsStore } from "../../stores/components";
import ComponentAttr from "./ComponentAttr";
import ComponentStyle from "./ComponentStyle";
import ComponentEvent from "./ComponentEvent";

const tabs = [
  { label: "属性", value: "props" },
  { label: "样式", value: "styles" },
  { label: "事件", value: "events" },
];

export function Setting() {
  const { curComponentId } = useComponentsStore();
  const [key, setKey] = useState<string>("props");

  if (!curComponentId) {
    return <div className="lce-setting-empty">Select a component in canvas to edit.</div>;
  }

  return (
    <div className="lce-setting-panel">
      <Segmented
        value={key}
        onChange={setKey}
        block
        options={tabs}
        className="lce-segmented"
      />
      <div className="lce-setting-content">
        {key === "props" && <ComponentAttr />}
        {key === "styles" && <ComponentStyle />}
        {key === "events" && <ComponentEvent />}
      </div>
    </div>
  );
}
