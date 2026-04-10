import {
  Button,
  Form,
  Image as AntdImage,
  Input,
  Select,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  normalizeChoiceMode,
  normalizeChoiceModeFieldValue,
  normalizeChoiceOptions,
  normalizeChoiceValue,
  normalizeMultipleChoiceValue,
  normalizeSingleChoiceValue,
  type ChoiceOption,
} from "../../materials/shared/choice";
import { useComponentsStore } from "../../stores/components";
import {
  useComponentConfigStore,
  type componentSetter,
} from "../../stores/component-config";

interface SetterInputProps<TValue> {
  value?: TValue;
  onChange?: (value: TValue) => void;
}

type OptionItem = ChoiceOption;

function normalizeOptionItems(value: unknown): OptionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeChoiceOptions(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return normalizeChoiceOptions(value);
}

function getCurrentOptionSelectOptions(currentProps: Record<string, unknown>) {
  return normalizeOptionItems(currentProps.options).map((item) => ({
    label: `${item.label} (${item.value})`,
    value: item.value,
  }));
}

function getSelectMode(currentProps: Record<string, unknown>) {
  return normalizeChoiceMode(currentProps.mode);
}

function getNormalizedComponentValue(
  componentName: string,
  currentProps: Record<string, unknown>,
  changeValues: Record<string, unknown>,
) {
  const mergedProps = {
    ...currentProps,
    ...changeValues,
  };
  const options = normalizeOptionItems(mergedProps.options);

  if (componentName === "Radio") {
    return normalizeSingleChoiceValue(mergedProps.value, options);
  }

  if (componentName === "Checkbox") {
    return normalizeMultipleChoiceValue(mergedProps.value, options);
  }

  if (componentName === "Select") {
    return normalizeChoiceValue(
      mergedProps.value,
      options,
      normalizeChoiceMode(mergedProps.mode),
    );
  }

  return mergedProps.value;
}

function getFormValues(
  componentName: string,
  defaultProps: Record<string, unknown>,
  currentProps: Record<string, unknown>,
) {
  const formValues = {
    ...defaultProps,
    ...currentProps,
  };

  if (componentName === "Select") {
    return {
      ...formValues,
      mode: normalizeChoiceModeFieldValue(formValues.mode),
      value: normalizeChoiceValue(
        formValues.value,
        normalizeOptionItems(formValues.options),
        normalizeChoiceMode(formValues.mode),
      ),
    };
  }

  if (componentName === "Radio" || componentName === "Checkbox") {
    return {
      ...formValues,
      value: getNormalizedComponentValue(componentName, formValues, {}),
    };
  }

  if (componentName === "DatePicker") {
    const format = String(formValues.format ?? "YYYY-MM-DD");
    const rawValue = formValues.value;
    const dateValue =
      typeof rawValue === "string" && rawValue
        ? (() => {
            const parsedValue = dayjs(rawValue, format);
            if (parsedValue.isValid()) {
              return parsedValue;
            }

            const fallbackValue = dayjs(rawValue);
            return fallbackValue.isValid() ? fallbackValue : undefined;
          })()
        : undefined;

    return {
      ...formValues,
      value: dateValue,
    };
  }

  return formValues;
}

function OptionsSetterInput({ value, onChange }: SetterInputProps<unknown>) {
  const normalizedValue = normalizeOptionItems(value);

  function updateAt(index: number, key: keyof OptionItem, nextValue: string) {
    const nextOptions = normalizedValue.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: nextValue } : item,
    );
    onChange?.(nextOptions);
  }

  function addOption() {
    onChange?.([
      ...normalizedValue,
      {
        label: `选项${normalizedValue.length + 1}`,
        value: `option${normalizedValue.length + 1}`,
      },
    ]);
  }

  function removeOption(index: number) {
    const nextOptions = normalizedValue.filter((_, itemIndex) => itemIndex !== index);
    onChange?.(nextOptions.length > 0 ? nextOptions : []);
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr 1fr auto",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="标签"
            value={item.label}
            onChange={(event) => updateAt(index, "label", event.target.value)}
          />
          <Input
            placeholder="值"
            value={item.value}
            onChange={(event) => updateAt(index, "value", event.target.value)}
          />
          <Button danger type="text" onClick={() => removeOption(index)}>
            删除
          </Button>
        </div>
      ))}
      <Button type="dashed" block onClick={addOption}>
        新增选项
      </Button>
    </div>
  );
}

function ImageSetterInput({
  value,
  onChange,
}: SetterInputProps<string | { src?: string }>) {
  const imageSrc =
    typeof value === "string"
      ? value
      : value && typeof value === "object" && "src" in value
        ? value.src || ""
        : "";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Input
        placeholder="https://example.com/cover.png"
        value={imageSrc}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {imageSrc ? (
        <AntdImage
          src={imageSrc}
          alt="preview"
          style={{
            width: "100%",
            maxHeight: 160,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ) : null}
    </div>
  );
}

export default function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponentId, curComponent, updateComponentProps, components } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  // 添加一个状态来强制更新组件
  const [, setForceUpdate] = useState({});

  // 当当前组件或组件列表变化时更新表单
  useEffect(() => {
    if (!curComponent) {
      return;
    }

    const config = componentConfig[curComponent.name];
    form.setFieldsValue(
      getFormValues(
        curComponent.name,
        (config?.defaultProps as Record<string, unknown>) ?? {},
        curComponent.props as Record<string, unknown>,
      ),
    );
  }, [curComponent, components, componentConfig, form]);

  if (!curComponentId || !curComponent) {
    return null;
  }

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
    if ((componentName === "Input" || componentName === "Textarea") && name === "value") {
      // 对于Input组件的value字段，使用当前组件的maxLength属性
      maxLength = currentProps.maxLength as number | undefined;
      // 如果没有设置，则使用默认值
      if (maxLength === undefined) {
        maxLength = config?.defaultProps?.maxLength as number | undefined;
      }
    }

    if (type === "select") {
      if (componentName === "Radio" && name === "value") {
        return (
          <Select
            options={getCurrentOptionSelectOptions(currentProps)}
            placeholder="请先配置选项"
            allowClear
          />
        );
      }

      if (componentName === "Checkbox" && name === "value") {
        return (
          <Select
            mode="multiple"
            options={getCurrentOptionSelectOptions(currentProps)}
            placeholder="请先配置选项"
          />
        );
      }

      if (componentName === "Select" && name === "value") {
        return (
          <Select
            mode={getSelectMode(currentProps)}
            options={getCurrentOptionSelectOptions(currentProps)}
            placeholder="请先配置选项"
            allowClear
          />
        );
      }

      if (componentName === "Select" && name === "mode") {
        return (
          <Select
            options={[
              { label: "单选", value: "single" },
              { label: "多选", value: "multiple" },
            ]}
          />
        );
      }

      return <Select options={options} />;
    }

    if (type === "input") {
      if (componentName === "Textarea" && name === "value") {
        const rows =
          (currentProps.rows as number | undefined) ??
          (config?.defaultProps?.rows as number | undefined) ??
          4;
        return <Input.TextArea maxLength={maxLength} rows={rows} />;
      }

      if (name === "value" && maxLength !== undefined) {
        return <Input maxLength={maxLength} />;
      }

      return <Input />;
    }

    if (type === "image") {
      return <ImageSetterInput />;
    }

    if (type === "switch") {
      return <Switch />;
    }

    if (type === "inputNumber") {
      return <InputNumber style={{ width: "100%" }} />;
    }

    if (type === "textarea") {
      return <Input.TextArea />;
    }

    if (type === "optionList") {
      return <OptionsSetterInput />;
    }

    if (type === "radio") {
      return <Radio.Group />;
    }

    if (type === "checkbox") {
      return <Checkbox.Group />;
    }

    if (type === "datePicker") {
      return <DatePicker />;
    }

    if (type === "timePicker") {
      return <TimePicker />;
    }

    if (type === "dateTimePicker") {
      return <DatePicker showTime />;
    }

    return <Input />;
  }

  function valueChange(changeValues: Record<string, unknown>) {
    if (!curComponentId) {
      return;
    }

    const normalizedChangeValues = { ...changeValues };

    if ("options" in normalizedChangeValues) {
      normalizedChangeValues.options = normalizeOptionItems(
        normalizedChangeValues.options,
      );
    }

    if (componentName === "DatePicker" && "value" in normalizedChangeValues) {
      const mergedFormat = String(
        normalizedChangeValues.format ?? currentProps.format ?? "YYYY-MM-DD",
      );
      const nextValue = normalizedChangeValues.value;

      normalizedChangeValues.value =
        nextValue && dayjs.isDayjs(nextValue) && nextValue.isValid()
          ? nextValue.format(mergedFormat)
          : undefined;
    }

    if (componentName === "Select" && "mode" in normalizedChangeValues) {
      normalizedChangeValues.mode =
        normalizedChangeValues.mode === "multiple" ? "multiple" : undefined;
    }

    if (
      componentName === "Radio" ||
      componentName === "Checkbox" ||
      componentName === "Select"
    ) {
      normalizedChangeValues.value = getNormalizedComponentValue(
        componentName,
        currentProps as Record<string, unknown>,
        normalizedChangeValues,
      );
    }

    updateComponentProps(curComponentId, normalizedChangeValues);
      // 强制更新组件以反映最新的props
    setForceUpdate({});
    
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
        <Form.Item
          key={setter.name}
          label={setter.label}
          name={setter.name}
          valuePropName={setter.type === "switch" ? "checked" : "value"}
        >
          {renderFormElement(setter, componentName, currentProps)}
        </Form.Item>
      ))}
    </Form>
  );
}
