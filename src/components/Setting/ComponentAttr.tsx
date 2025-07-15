import {
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useComponentsStore } from "../../stores/components";
import {
  useComponentConfigStore,
  type componentSetter,
} from "../../stores/component-config";

export default function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponentId, curComponent, updateComponentProps, components } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  // 添加一个状态来强制更新组件
  const [, setForceUpdate] = useState({});

  // 当当前组件或组件列表变化时更新表单
  useEffect(() => {
    if (curComponent) {
      form.setFieldsValue({ ...curComponent.props });
    }
  }, [curComponent, components, form]);

  // 如果没有选中的组件，不渲染任何内容
  if (!curComponentId || !curComponent) return null;

  // 渲染表单元素
  function renderFormElement(
    setting: componentSetter,
    componentName: string,
    currentProps: Record<string, unknown>
  ) {
    const { type, options, name } = setting;

    // 获取当前组件的配置
    const config = componentConfig[componentName];

    // 获取最大长度限制，优先使用组件当前的props中的maxLength
    let maxLength: number | undefined;
    if (componentName === "Input" && name === "value") {
      // 对于Input组件的value字段，使用当前组件的maxLength属性
      maxLength = currentProps.maxLength as number | undefined;
      // 如果没有设置，则使用默认值
      if (maxLength === undefined) {
        maxLength = config?.defaultProps?.maxLength as number | undefined;
      }
    }

    if (type === "select") {
      return <Select options={options} />;
    } else if (type === "input") {
      // 如果是value字段且有maxLength限制，则应用最大长度限制
      if (name === "value" && maxLength !== undefined) {
        return <Input maxLength={maxLength} />;
      }
      return <Input />;
    } else if (type === "switch") {
      return <Switch />;
    } else if (type === "inputNumber") {
      return <InputNumber style={{ width: "100%" }} />;
    } else if (type === "textarea") {
      return <Input.TextArea />;
    } else if (type === "radio") {
      return <Radio.Group />;
    } else if (type === "checkbox") {
      return <Checkbox.Group />;
    } else if (type === "datePicker") {
      return <DatePicker />;
    } else if (type === "timePicker") {
      return <TimePicker />;
    } else if (type === "dateTimePicker") {
      return <DatePicker showTime />;
    }
    return <Input />;
  }

  function valueChange(changeValues: Record<string, unknown>) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
      // 强制更新组件以反映最新的props
      setForceUpdate({});
    }
  }

  // 获取组件名称和当前属性
  const componentName = curComponent.name;
  const currentProps = curComponent.props;

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
        <Input value={componentName} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[componentName]?.setter?.map((setter) => (
        <Form.Item key={setter.name} label={setter.label} name={setter.name}>
          {renderFormElement(setter, componentName, currentProps)}
        </Form.Item>
      ))}
    </Form>
  );
}
