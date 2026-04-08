import { forwardRef, useEffect, useMemo } from "react";
import type { RadioChangeEvent } from "antd";
import type { CommonComponentProps } from "../../interface";
import { useComponentsStore } from "../../stores/components";
import { RADIO_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { RadioGroup, materials } from "../ui";

interface RadioOption {
  label: string;
  value: string;
}

type RadioProps = Omit<CommonComponentProps, "children"> & {
  value?: string;
  options?: RadioOption[];
  optionType?: "default" | "button";
  disabled?: boolean;
};

const defaultOptions: RadioOption[] = [
  { label: "选项一", value: "option1" },
  { label: "选项二", value: "option2" },
];

function normalizeRadioOptions(options: unknown): RadioOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  const normalizedOptions = options
    .filter(
      (item): item is RadioOption =>
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        "value" in item,
    )
    .map((item) => ({
      label: String(item.label),
      value: String(item.value),
    }))
    .filter((item) => item.value.trim());

  return normalizedOptions;
}

function useManagedRadioValue(id: number, value: unknown, options: RadioOption[]) {
  const { updateComponentProps } = useComponentsStore();
  const radioValue = useMemo(() => {
    const normalizedValue = String(value ?? "");
    const hasMatchingOption = options.some((option) => option.value === normalizedValue);

    if (hasMatchingOption) {
      return normalizedValue;
    }

    return options[0]?.value ?? "";
  }, [options, value]);

  useEffect(() => {
    if (radioValue !== String(value ?? "")) {
      updateComponentProps(id, { value: radioValue });
    }
  }, [id, radioValue, updateComponentProps, value]);

  function updateValue(nextValue: string) {
    updateComponentProps(id, { value: nextValue });
  }

  return {
    radioValue,
    updateValue,
  };
}

const RadioRenderer = forwardRef<HTMLDivElement, RadioProps>(
  (
    {
      id,
      value = "option1",
      options = defaultOptions,
      optionType = "default",
      disabled = false,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedOptions = normalizeRadioOptions(options);
    const { radioValue, updateValue } = useManagedRadioValue(
      id,
      value,
      normalizedOptions,
    );

    const handleChange = (e: RadioChangeEvent) => {
      const nextValue = String(e.target.value ?? "");
      updateValue(nextValue);
      onChange?.(e);
    };

    return (
      <div ref={ref} data-component-id={id}>
        <RadioGroup
          {...materials.RadioGroup.mapProps(
            {
              value: radioValue,
              options: normalizedOptions,
              optionType,
              disabled,
              onChange: handleChange,
              styles,
              ...props,
            },
            { mode: "preview" },
          )}
        />
      </div>
    );
  },
);

const RadioEditorRenderer = forwardRef<HTMLDivElement, RadioProps>(
  (
    {
      id,
      value = "option1",
      options = defaultOptions,
      optionType = "default",
      disabled = false,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedOptions = normalizeRadioOptions(options);
    const { radioValue, updateValue } = useManagedRadioValue(
      id,
      value,
      normalizedOptions,
    );

    const handleChange = (e: RadioChangeEvent) => {
      const nextValue = String(e.target.value ?? "");
      updateValue(nextValue);
      onChange?.(e);
    };

    return (
      <div ref={ref} data-component-id={id}>
        <RadioGroup
          {...materials.RadioGroup.mapProps(
            {
              value: radioValue,
              options: normalizedOptions,
              optionType,
              disabled,
              onChange: handleChange,
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

RadioRenderer.displayName = "RadioRenderer";
RadioEditorRenderer.displayName = "RadioEditorRenderer";

export default createLeafMaterial({
  name: "Radio",
  category: "form",
  desc: "单选框",
  defaultProps: {
    value: "option1",
    optionType: "default",
    disabled: false,
    options: defaultOptions,
  },
  allowedParents: [...RADIO_ALLOWED_PARENTS],
  setter: [
    field.select("value", "当前选中", []),
    field.optionList("options", "选项"),
    field.select("optionType", "风格", [
      { label: "默认", value: "default" },
      { label: "按钮", value: "button" },
    ]),
    field.switch("disabled", "禁用"),
  ],
  events: [{ name: "onChange", label: "值变化事件" }],
  render: RadioRenderer,
  renderInEditor: RadioEditorRenderer,
});
