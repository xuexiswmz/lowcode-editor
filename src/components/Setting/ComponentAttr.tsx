import { Form, Input, Select, Switch, InputNumber } from "antd";
import { useEffect } from "react";
import { useComponentsStore } from "../../stores/components";
import {
  useComponentConfigStore,
  type componentSetter,
} from "../../stores/component-config";

export default function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.props });
  }, [curComponent]);

  if (!curComponentId || !curComponent) return null;

  //TODO: 增加组件后扩展表单项
  function renderFormElement(setting: componentSetter) {
    const { type, options } = setting;
    if (type === "select") {
      return <Select options={options} />;
    } else if (type === "input") {
      return <Input />;
    } else if (type === "switch") {
      return <Switch />;
    } else if (type === "inputNumber") {
      return <InputNumber style={{ width: "100%" }} />;
    }
    return <Input />;
  }

  function valueChange(changeValues: Record<string, unknown>) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  }
  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[curComponent.name]?.setter?.map((setter) => (
        <Form.Item key={setter.name} label={setter.label} name={setter.name}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  );
}
