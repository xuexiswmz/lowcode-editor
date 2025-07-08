import { Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState, type CSSProperties } from "react";
import {
  useComponentConfigStore,
  type componentSetter,
} from "../../stores/component-config";
import { useComponentsStore } from "../../stores/components";
import CssEditor from "./CssEditor";
import { debounce } from "lodash-es";
import StyleToObject from "style-to-object";

export default function ComponentStyle() {
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [css, setCss] = useState<string>(`.comp{\n\n}`);

  useEffect(() => {
    form.resetFields();
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });
    setCss(toCSSStr(curComponent?.styles || {}));
  }, [curComponent]);

  function toCSSStr(css: CSSProperties) {
    let str = `.comp{\n`;
    for (const key in css) {
      let value = css[key as keyof CSSProperties];
      if (!value) {
        continue;
      }
      if (
        ["width", "height"].includes(key) &&
        !value.toString().endsWith("px")
      ) {
        value += "px";
      }
      str += `\t${key}: ${value};\n`;
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
      <Input />;
    } else if (type === "inputNumber") {
      return <InputNumber />;
    }
  }

  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  }
  const handleEditorChange = debounce((value) => {
    const css: Record<string, unknown> = {};
    try {
      const cssStr = value
        .replace(/\/\*.*\*\//, "")
        .replace(/(\.?[^{]+{)/, "")
        .replace("}", "");
      StyleToObject(cssStr, (name, value) => {
        css[
          name.replace(/-\w/, (item) => item.toUpperCase().replace("-", ""))
        ] = value;
      });
      console.log(css);
      updateComponentStyles(
        curComponentId,
        { ...form.getFieldsValue(), ...css },
        true
      );
    } catch (e) {
      console.log(e);
    }
  }, 500);
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
