import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { CHECKBOX_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import {
  normalizeChoiceOptions,
  useManagedChoiceValue,
  type ChoiceOption,
} from "../shared/choice";
import { CheckboxGroup, materials } from "../ui";

type CheckboxProps = Omit<CommonComponentProps, "children"> & {
  value?: string[];
  options?: ChoiceOption[];
  disabled?: boolean;
};

const defaultOptions: ChoiceOption[] = [
  { label: "选项一", value: "option1" },
  { label: "选项二", value: "option2" },
];

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
    const normalizedOptions = normalizeChoiceOptions(options ?? defaultOptions);
    const { normalizedValue: checkboxValue, updateValue } = useManagedChoiceValue(
      id,
      value,
      normalizedOptions,
      "multiple",
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
    const normalizedOptions = normalizeChoiceOptions(options ?? defaultOptions);
    const { normalizedValue: checkboxValue, updateValue } = useManagedChoiceValue(
      id,
      value,
      normalizedOptions,
      "multiple",
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
