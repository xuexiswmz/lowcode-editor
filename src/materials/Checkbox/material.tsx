import { forwardRef, useEffect, useMemo } from "react";
import type { CommonComponentProps } from "../../interface";
import { useComponentsStore } from "../../stores/components";
import { CHECKBOX_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { CheckboxGroup, materials } from "../ui";

interface CheckboxOption {
  label: string;
  value: string;
}

type CheckboxProps = Omit<CommonComponentProps, "children"> & {
  value?: string[];
  options?: CheckboxOption[];
  disabled?: boolean;
};

const defaultOptions: CheckboxOption[] = [
  { label: "选项一", value: "option1" },
  { label: "选项二", value: "option2" },
];

function normalizeCheckboxOptions(options: unknown): CheckboxOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .filter(
      (item): item is CheckboxOption =>
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
}

function normalizeCheckboxValue(value: unknown, options: CheckboxOption[]) {
  if (!Array.isArray(value)) {
    return [];
  }

  const optionValues = new Set(options.map((option) => option.value));

  return value
    .map((item) => String(item))
    .filter((item) => optionValues.has(item));
}

function useManagedCheckboxValue(
  id: number,
  value: unknown,
  options: CheckboxOption[],
) {
  const { updateComponentProps } = useComponentsStore();
  const checkboxValue = useMemo(
    () => normalizeCheckboxValue(value, options),
    [options, value],
  );

  useEffect(() => {
    const rawValue = Array.isArray(value) ? value.map((item) => String(item)) : [];
    const hasChanged =
      rawValue.length !== checkboxValue.length ||
      rawValue.some((item, index) => item !== checkboxValue[index]);

    if (hasChanged) {
      updateComponentProps(id, { value: checkboxValue });
    }
  }, [checkboxValue, id, updateComponentProps, value]);

  function updateValue(nextValue: string[]) {
    updateComponentProps(id, { value: nextValue });
  }

  return {
    checkboxValue,
    updateValue,
  };
}

const CheckboxRenderer = forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      id,
      value = ["option1"],
      options = defaultOptions,
      disabled = false,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedOptions = normalizeCheckboxOptions(options);
    const { checkboxValue, updateValue } = useManagedCheckboxValue(
      id,
      value,
      normalizedOptions,
    );

    const handleChange = (checkedValues: Array<string | number | boolean>) => {
      const nextValue = checkedValues.map((item) => String(item));
      updateValue(nextValue);
      onChange?.(nextValue);
    };

    return (
      <div ref={ref} data-component-id={id}>
        <CheckboxGroup
          {...materials.CheckboxGroup.mapProps(
            {
              value: checkboxValue,
              options: normalizedOptions,
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

const CheckboxEditorRenderer = forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      id,
      value = ["option1"],
      options = defaultOptions,
      disabled = false,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedOptions = normalizeCheckboxOptions(options);
    const { checkboxValue, updateValue } = useManagedCheckboxValue(
      id,
      value,
      normalizedOptions,
    );

    const handleChange = (checkedValues: Array<string | number | boolean>) => {
      const nextValue = checkedValues.map((item) => String(item));
      updateValue(nextValue);
      onChange?.(nextValue);
    };

    return (
      <div ref={ref} data-component-id={id}>
        <CheckboxGroup
          {...materials.CheckboxGroup.mapProps(
            {
              value: checkboxValue,
              options: normalizedOptions,
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

CheckboxRenderer.displayName = "CheckboxRenderer";
CheckboxEditorRenderer.displayName = "CheckboxEditorRenderer";

export default createLeafMaterial({
  name: "Checkbox",
  category: "form",
  desc: "多选框",
  defaultProps: {
    value: ["option1"],
    disabled: false,
    options: defaultOptions,
  },
  allowedParents: [...CHECKBOX_ALLOWED_PARENTS],
  setter: [
    field.select("value", "当前选中", [], { mode: "multiple" }),
    field.optionList("options", "选项"),
    field.switch("disabled", "禁用"),
  ],
  events: [{ name: "onChange", label: "值变化事件" }],
  render: CheckboxRenderer,
  renderInEditor: CheckboxEditorRenderer,
});
