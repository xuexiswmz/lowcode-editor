import {
  Checkbox,
  DatePicker,
  Image as AntdImage,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TimePicker,
} from "antd";
import type { SetterRendererProps } from "../types";
import {
  getCurrentMenuSelectOptions,
  getCurrentOptionSelectOptions,
  getCurrentStepSelectOptions,
  getCurrentTabSelectOptions,
  getSelectMode,
} from "../utils/options";

export function BasicSelectSetter({
  setting,
  componentName,
  currentProps,
}: SetterRendererProps) {
  const { options, name } = setting;

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

  if (componentName === "Tabs" && name === "activeKey") {
    return (
      <Select
        options={getCurrentTabSelectOptions(currentProps)}
        placeholder="请先配置面板"
        allowClear
      />
    );
  }

  if (componentName === "Menu" && name === "selectedKeys") {
    return (
      <Select
        mode="multiple"
        options={getCurrentMenuSelectOptions(currentProps)}
        placeholder="请先配置可选菜单项"
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

  return (
    <Select
      options={options as { label: string; value: string }[] | undefined}
    />
  );
}

export function BasicInputSetter({
  setting,
  componentName,
  currentProps,
  config,
}: SetterRendererProps) {
  const { name } = setting;

  let maxLength: number | undefined;
  if ((componentName === "Input" || componentName === "Textarea") && name === "value") {
    maxLength = currentProps.maxLength as number | undefined;
    if (maxLength === undefined) {
      maxLength = config?.defaultProps?.maxLength as number | undefined;
    }
  }

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

export function BasicSwitchSetter() {
  return <Switch />;
}

export function BasicInputNumberSetter({
  setting,
  componentName,
  currentProps,
}: SetterRendererProps) {
  if (componentName === "Steps" && setting.name === "current") {
    return (
      <Select
        options={getCurrentStepSelectOptions(currentProps)}
        placeholder="请先配置步骤项"
      />
    );
  }

  return <InputNumber style={{ width: "100%" }} />;
}

export function BasicTextareaSetter() {
  return <Input.TextArea />;
}

export function ImageSetter({ value, onChange }: SetterRendererProps) {
  const normalizedValue = value as string | { src?: string } | undefined;
  const imageSrc =
    typeof normalizedValue === "string"
      ? normalizedValue
      : normalizedValue &&
          typeof normalizedValue === "object" &&
          "src" in normalizedValue
        ? normalizedValue.src || ""
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

export function ReadonlyJsonSetter({ value }: SetterRendererProps) {
  return (
    <Input.TextArea
      value={JSON.stringify(value ?? [], null, 2)}
      autoSize={{ minRows: 4, maxRows: 10 }}
      readOnly
    />
  );
}

export function RadioSetter() {
  return <Radio.Group />;
}

export function CheckboxSetter() {
  return <Checkbox.Group />;
}

export function DatePickerSetter() {
  return <DatePicker />;
}

export function TimePickerSetter() {
  return <TimePicker />;
}

export function DateTimePickerSetter() {
  return <DatePicker showTime />;
}

export function FallbackInputSetter() {
  return <Input />;
}
