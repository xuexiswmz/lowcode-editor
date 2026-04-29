import { Form, Input } from "antd";
import type { FormInstance } from "antd";
import type { Component } from "../../../stores/components";
import type {
  ComponentConfig,
  componentSetter,
} from "../../../stores/component-config";
import { FallbackInputSetter, setterRegistry } from "./setter-registry";

interface AttrFormProps {
  form: FormInstance;
  curComponent: Component;
  curComponentId: number;
  config: ComponentConfig;
  onValuesChange: (changeValues: Record<string, unknown>) => void;
}

function renderSetter(
  setter: componentSetter,
  componentName: string,
  currentProps: Record<string, unknown>,
  config: ComponentConfig,
) {
  const SetterComponent = setterRegistry[setter.type] ?? FallbackInputSetter;

  return (
    <SetterComponent
      setting={setter}
      componentName={componentName}
      currentProps={currentProps}
      config={config}
    />
  );
}

export default function AttrForm({
  form,
  curComponent,
  curComponentId,
  config,
  onValuesChange,
}: AttrFormProps) {
  const componentName = curComponent.name;
  const currentProps = curComponent.props as Record<string, unknown>;

  return (
    <Form
      form={form}
      onValuesChange={(changedValues) =>
        onValuesChange(changedValues as Record<string, unknown>)
      }
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponentId} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={componentName} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {config.setter?.map((setter) => (
        <Form.Item
          key={setter.name}
          label={setter.label}
          name={setter.name}
          valuePropName={setter.type === "switch" ? "checked" : "value"}
        >
          {renderSetter(setter, componentName, currentProps, config)}
        </Form.Item>
      ))}
    </Form>
  );
}
