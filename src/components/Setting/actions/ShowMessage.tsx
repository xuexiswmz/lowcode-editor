import { Input, Select } from "antd";
import { useComponentsStore } from "../../../stores/components";
import { useEffect, useState } from "react";

export interface ShowMessageConfig {
  type: "showMessage";
  config: {
    type: "success" | "error";
    text: string;
  };
}
export interface ShowMessageProps {
  value?: ShowMessageConfig["config"];
  defaultvalue?: ShowMessageConfig["config"];
  onChange?: (config: ShowMessageConfig) => void;
}
export default function ShowMessage(props: ShowMessageProps) {
  const { value: val, defaultvalue, onChange } = props;
  const { curComponentId } = useComponentsStore();
  const [type, setType] = useState<"success" | "error">(
    defaultvalue?.type || "success"
  );
  const [text, setText] = useState<string>(defaultvalue?.text || "");

  useEffect(() => {
    if (val) {
      setType(val.type);
      setText(val.text);
    }
  });

  function messageTypeChange(value: "success" | "error") {
    if (!curComponentId) return;
    setType(value);
    onChange?.({
      type: "showMessage",
      config: {
        type: value,
        text,
      },
    });
  }
  function messageTextChange(value: string) {
    if (!curComponentId) return;
    setText(value);
    onChange?.({
      type: "showMessage",
      config: {
        type,
        text: value,
      },
    });
  }
  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>类型：</div>
        <div>
          <Select
            style={{ width: 100, height: 50, marginTop: 20 }}
            options={[
              { label: "成功", value: "success" },
              { label: "失败", value: "error" },
            ]}
            onChange={(value) => {
              messageTypeChange(value);
            }}
            value={type}
          />
        </div>
      </div>
      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>文本：</div>
        <div>
          <Input
            style={{ width: 300, height: 50, marginTop: 20 }}
            onChange={(e) => {
              messageTextChange(e.target.value);
            }}
            value={text}
          />
        </div>
      </div>
    </div>
  );
}
