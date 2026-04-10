import { forwardRef, type ComponentRef } from "react";
import dayjs, { type Dayjs } from "dayjs";
import type { CommonComponentProps } from "../../interface";
import { useComponentsStore } from "../../stores/components";
import { DATE_PICKER_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { DatePicker, materials } from "../ui";

type DatePickerMode = "date" | "week" | "month" | "quarter" | "year";

type DatePickerProps = Omit<CommonComponentProps, "children"> & {
  value?: string;
  picker?: DatePickerMode;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
};

type MaterialDatePickerRef = ComponentRef<typeof DatePicker>;

const pickerOptions = [
  { label: "日期", value: "date" },
  { label: "周", value: "week" },
  { label: "月", value: "month" },
  { label: "季度", value: "quarter" },
  { label: "年", value: "year" },
] as const;

function getDatePickerFormat(picker: DatePickerMode = "date", format?: string) {
  if (format) {
    return format;
  }

  switch (picker) {
    case "week":
      return "YYYY-[W]WW";
    case "month":
      return "YYYY-MM";
    case "quarter":
      return "YYYY-[Q]Q";
    case "year":
      return "YYYY";
    case "date":
    default:
      return "YYYY-MM-DD";
  }
}

function getDatePickerPlaceholder(picker: DatePickerMode = "date", placeholder?: string) {
  if (placeholder) {
    return placeholder;
  }

  switch (picker) {
    case "week":
      return "请选择周";
    case "month":
      return "请选择月份";
    case "quarter":
      return "请选择季度";
    case "year":
      return "请选择年份";
    case "date":
    default:
      return "请选择日期";
  }
}

function parseDateValue(value: unknown, format: string) {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const parsedValue = dayjs(value, format);
  if (parsedValue.isValid()) {
    return parsedValue;
  }

  const fallbackValue = dayjs(value);
  return fallbackValue.isValid() ? fallbackValue : undefined;
}

function serializeDateValue(value: Dayjs | null | undefined, format: string) {
  if (!value || !dayjs.isDayjs(value) || !value.isValid()) {
    return undefined;
  }

  return value.format(format);
}

const DatePickerRenderer = forwardRef<MaterialDatePickerRef, DatePickerProps>(
  (
    {
      id,
      value,
      picker = "date",
      format,
      placeholder,
      disabled = false,
      onChange,
      onOpenChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const { updateComponentProps } = useComponentsStore();
    const resolvedFormat = getDatePickerFormat(picker, format);
    const dateValue = parseDateValue(value, resolvedFormat);

    return (
      <DatePicker
        ref={ref}
        {...materials.DatePicker.mapProps(
          {
            value: dateValue,
            picker,
            format: resolvedFormat,
            placeholder: getDatePickerPlaceholder(picker, placeholder),
            disabled,
            onChange: (nextValue: Dayjs | null) => {
              const serializedValue = serializeDateValue(nextValue, resolvedFormat);
              updateComponentProps(id, { value: serializedValue });
              onChange?.(nextValue, serializedValue);
            },
            onOpenChange,
            styles,
            ...props,
          },
          { mode: "preview" },
        )}
      />
    );
  },
);

const DatePickerEditorRenderer = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      id,
      value,
      picker = "date",
      format,
      placeholder,
      disabled = false,
      onChange,
      onOpenChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const { updateComponentProps } = useComponentsStore();
    const resolvedFormat = getDatePickerFormat(picker, format);
    const dateValue = parseDateValue(value, resolvedFormat);

    return (
      <div ref={ref} data-component-id={id}>
        <DatePicker
          {...materials.DatePicker.mapProps(
            {
              value: dateValue,
              picker,
              format: resolvedFormat,
              placeholder: getDatePickerPlaceholder(picker, placeholder),
              disabled,
              onChange: (nextValue: Dayjs | null) => {
                const serializedValue = serializeDateValue(nextValue, resolvedFormat);
                updateComponentProps(id, { value: serializedValue });
                onChange?.(nextValue, serializedValue);
              },
              onOpenChange,
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        />
      </div>
    );
  },
);

DatePickerRenderer.displayName = "DatePickerRenderer";
DatePickerEditorRenderer.displayName = "DatePickerEditorRenderer";

export default createLeafMaterial({
  name: "DatePicker",
  category: "form",
  desc: "日期选择",
  defaultProps: {
    value: undefined,
    picker: "date",
    format: "YYYY-MM-DD",
    placeholder: "请选择日期",
    disabled: false,
  },
  allowedParents: [...DATE_PICKER_ALLOWED_PARENTS],
  setter: [
    field.datePicker("value", "值"),
    field.select("picker", "类型", [...pickerOptions]),
    field.input("format", "格式"),
    field.input("placeholder", "占位符"),
    field.switch("disabled", "禁用"),
  ],
  events: [
    { name: "onChange", label: "值变化事件" },
    { name: "onOpenChange", label: "面板开关事件" },
  ],
  methods: [
    { name: "focus", label: "聚焦" },
    { name: "blur", label: "失焦" },
  ],
  render: DatePickerRenderer,
  renderInEditor: DatePickerEditorRenderer,
});
