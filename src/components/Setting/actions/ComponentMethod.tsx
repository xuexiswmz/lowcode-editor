import { useEffect, useState } from "react";
import {
  getComponentById,
  useComponentsStore,
  type Component,
} from "../../../stores/components";
import { useComponentConfigStore } from "../../../stores/component-config";
import { Select, TreeSelect } from "antd";

export interface ComponentMethodConfig {
  type: "componentMethod";
  config: {
    componentId: number;
    method: string;
  };
}

export interface ComponentMethodProps {
  value?: ComponentMethodConfig["config"];
  onChange?: (config: ComponentMethodConfig) => void;
}

export default function ComponentMethod(props: ComponentMethodProps) {
  const { value, onChange } = props;
  const { components, curComponentId } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [curId, setCurId] = useState<number>();
  const [curMethod, setCurMethod] = useState<string>();

  useEffect(() => {
    if (value) {
      setCurId(value.componentId);
      setCurMethod(value.method);
      setSelectedComponent(getComponentById(value.componentId, components));
    }
  });

  function componentChange(value: number) {
    if (!curComponentId) return;
    setSelectedComponent(getComponentById(value, components));
  }

  function componentMethodChange(value: string) {
    if (!curComponentId || !selectedComponent) return;
    setCurMethod(value);
    onChange?.({
      type: "componentMethod",
      config: {
        componentId: selectedComponent?.id,
        method: value,
      },
    });
  }

  return (
    <div className="mt-[40px]">
      <div className="flex items-center gap-[10px]">
        <div>组件:</div>
        <div>
          <TreeSelect
            style={{ width: 500, height: 50 }}
            treeData={components}
            fieldNames={{
              label: "name",
              value: "id",
            }}
            value={curId}
            onChange={(value) => {
              componentChange(value);
            }}
          />
        </div>
      </div>
      {componentConfig[selectedComponent?.name || ""] && (
        <div className="flex items-center gap-[10px] mt-[20px]">
          <div>方法:</div>
          <div>
            <Select
              style={{ width: 500, height: 50 }}
              options={componentConfig[
                selectedComponent?.name || ""
              ].methods?.map((method) => ({
                label: method.label,
                value: method.name,
              }))}
              value={curMethod}
              onChange={(value) => {
                componentMethodChange(value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
