import { useState } from "react";
import { useComponentsStore } from "../../stores/components";
import { Segmented } from "antd";
import ComponentAttr from "./ComponentAttr";
import ComponentStyle from "./ComponentStyle";
import ComponentEvent from "./ComponentEvent";

export function Setting() {
  const { curComponentId } = useComponentsStore();
  const [key, setKey] = useState<string>("属性");

  if (!curComponentId) return null;

  return (
    <div>
      <Segmented
        value={key}
        onChange={setKey}
        block
        options={["属性", "样式", "事件"]}
        style={{ padding: "5px" }}
      />
      <div className="pt-[20px]">
        {key === "属性" && <ComponentAttr />}
        {key === "样式" && <ComponentStyle />}
        {key === "事件" && <ComponentEvent />}
      </div>
    </div>
  );
}
