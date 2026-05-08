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
export function BasicSelectSetter({ setting }: SetterRendererProps) {
  const inputProps = (setting.props ?? {}) as Record<string, unknown>;

  return (
    <Select
      options={setting.options as { label: string; value: string }[] | undefined}
      disabled={Boolean(setting.disabled)}
      {...inputProps}
    />
  );
}

export function BasicInputSetter({
  setting,
}: SetterRendererProps) {
  return (
    <Input
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function BasicSwitchSetter({ setting }: SetterRendererProps) {
  return (
    <Switch
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function BasicInputNumberSetter({ setting }: SetterRendererProps) {
  return (
    <InputNumber
      style={{ width: "100%" }}
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function BasicTextareaSetter({ setting }: SetterRendererProps) {
  return (
    <Input.TextArea
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
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

export function RadioSetter({ setting }: SetterRendererProps) {
  return (
    <Radio.Group
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function CheckboxSetter({ setting }: SetterRendererProps) {
  return (
    <Checkbox.Group
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function DatePickerSetter({ setting }: SetterRendererProps) {
  return (
    <DatePicker
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function TimePickerSetter({ setting }: SetterRendererProps) {
  return (
    <TimePicker
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function DateTimePickerSetter({ setting }: SetterRendererProps) {
  return (
    <DatePicker
      showTime
      disabled={Boolean(setting.disabled)}
      {...((setting.props ?? {}) as Record<string, unknown>)}
    />
  );
}

export function FallbackInputSetter() {
  return <Input />;
}
