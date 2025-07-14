import { Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState, type CSSProperties } from "react";
import {
  useComponentConfigStore,
  type componentSetter,
} from "../../stores/component-config";
import { useComponentsStore } from "../../stores/components";
import CssEditor from "./CssEditor";
import StyleToObject from "style-to-object";
import { useDebounceFunction } from "../../hooks/useDebounce";
import { type EditorProps } from "@monaco-editor/react";

export default function ComponentStyle() {
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [css, setCss] = useState<string>(`.comp{\n\n}`);

  // 将所有Hook移到组件顶部
  const debouncedValueChange = useDebounceFunction((...args: unknown[]) => {
    const styles = args[0] as CSSProperties;
    if (curComponentId) {
      updateComponentStyles(curComponentId, styles);
    }
  }, 500);

  const handleEditorChangeDebounced = useDebounceFunction(
    (...args: unknown[]) => {
      const value = args[0] as string | undefined;
      if (!curComponentId || !value) return;

      const cssObj: Record<string, unknown> = {};
      try {
        const cssStr = value
          .replace(/\/\*.*\*\//, "")
          .replace(/(\.?[^{]+{)/, "")
          .replace("}", "");
        StyleToObject(cssStr, (name, value) => {
          cssObj[
            name.replace(/-\w/, (item) => item.toUpperCase().replace("-", ""))
          ] = value;
        });
        console.log(cssObj);
        updateComponentStyles(
          curComponentId,
          { ...form.getFieldsValue(), ...cssObj },
          true
        );
      } catch (e) {
        console.log(e);
      }
    },
    500
  );

  useEffect(() => {
    form.resetFields();
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });
    setCss(toCSSStr(curComponent?.styles || {}));
  }, [curComponent]);

  function toCSSStr(css: CSSProperties) {
    let str = `.comp{\n`;
    for (const key in css) {
      const value = css[key as keyof CSSProperties];
      if (!value) {
        continue;
      }

      let valueStr = String(value);

      // 为数字值添加 px 单位
      if (
        ["width", "height", "margin", "padding", "borderRadius"].includes(
          key
        ) &&
        typeof value === "number" &&
        !valueStr.endsWith("px")
      ) {
        valueStr += "px";
      }

      str += `\t${key}: ${valueStr};\n`;
    }
    str += `}`;
    return str;
  }

  if (!curComponentId || !curComponent) return null;

  function renderFormElement(setting: componentSetter) {
    const { type, options } = setting;
    if (type === "select") {
      return <Select options={options} />;
    } else if (type === "input") {
      return <Input />;
    } else if (type === "inputNumber") {
      return <InputNumber />;
    }
    return <Input />;
  }

  function valueChange(changeValues: CSSProperties) {
    // 立即更新 CSS 编辑器显示
    const currentValues = form.getFieldsValue();
    const newStyles = { ...currentValues, ...changeValues };
    setCss(toCSSStr(newStyles));

    // 防抖更新组件样式
    debouncedValueChange[0](newStyles);
  }

  const handleEditorChange: EditorProps["onChange"] = (value) => {
    handleEditorChangeDebounced[0](value);
  };

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {componentConfig[curComponent.name]?.stylesSetter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
      <div className="h-[200px] border-[1px] border-[#ccc] ">
        <CssEditor value={css} onChange={handleEditorChange} />
      </div>
    </Form>
  );
}
