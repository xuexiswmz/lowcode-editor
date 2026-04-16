import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SELECT_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import {
  normalizeChoiceMode,
  normalizeChoiceOptions,
  useManagedChoiceValue,
  type ChoiceMode,
  type ChoiceOption,
} from "../shared/choice";
import { getComponentPopupContainer } from "../shared/popup";
import { Select, materials } from "../ui";

type SelectProps = Omit<CommonComponentProps, "children"> & {
  value?: string | string[];
  options?: ChoiceOption[];
  mode?: ChoiceMode;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
};

const defaultOptions: ChoiceOption[] = [
  { label: "选项一", value: "option1" },
  { label: "选项二", value: "option2" },
];

const SelectRenderer = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      id,
      value,
      options,
      mode,
      placeholder = "请选择",
      disabled = false,
      allowClear = true,
      onChange,
      onSelect,
      onSearch,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedMode = normalizeChoiceMode(mode);
    const normalizedOptions = normalizeChoiceOptions(options ?? defaultOptions);
    const { normalizedValue: selectValue, updateValue } = useManagedChoiceValue(
      id,
      value,
      normalizedOptions,
      normalizedMode,
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Select
          {...materials.Select.mapProps(
            {
              value: selectValue,
              options: normalizedOptions,
              mode: normalizedMode,
              placeholder,
              disabled,
              allowClear,
              onChange: (nextValue: string | string[] | undefined) => {
                updateValue(nextValue);
                onChange?.(nextValue);
              },
              onSelect,
              onSearch,
              showSearch: true,
              getPopupContainer: getComponentPopupContainer,
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

const SelectEditorRenderer = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      id,
      value,
      options,
      mode,
      placeholder = "请选择",
      disabled = false,
      allowClear = true,
      onChange,
      onSelect,
      onSearch,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedMode = normalizeChoiceMode(mode);
    const normalizedOptions = normalizeChoiceOptions(options ?? defaultOptions);
    const { normalizedValue: selectValue, updateValue } = useManagedChoiceValue(
      id,
      value,
      normalizedOptions,
      normalizedMode,
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Select
          {...materials.Select.mapProps(
            {
              value: selectValue,
              options: normalizedOptions,
              mode: normalizedMode,
              placeholder,
              disabled,
              allowClear,
              onChange: (nextValue: string | string[] | undefined) => {
                updateValue(nextValue);
                onChange?.(nextValue);
              },
              onSelect,
              onSearch,
              showSearch: true,
              getPopupContainer: getComponentPopupContainer,
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

SelectRenderer.displayName = "SelectRenderer";
SelectEditorRenderer.displayName = "SelectEditorRenderer";

export default createLeafMaterial({
  name: "Select",
  category: "form",
  desc: "下拉选择",
  defaultProps: {
    value: "option1",
    options: defaultOptions,
    mode: undefined,
    placeholder: "请选择",
    disabled: false,
    allowClear: true,
  },
  allowedParents: [...SELECT_ALLOWED_PARENTS],
  setter: [
    field.select("value", "当前选中", []),
    field.optionList("options", "选项"),
    field.select("mode", "模式", [
      { label: "单选", value: "single" },
      { label: "多选", value: "multiple" },
    ]),
    field.input("placeholder", "占位符"),
    field.switch("disabled", "禁用"),
    field.switch("allowClear", "允许清空"),
  ],
  events: [
    { name: "onChange", label: "值变化事件" },
    { name: "onSelect", label: "选择事件" },
    { name: "onSearch", label: "搜索事件" },
  ],
  methods: [
    { name: "focus", label: "聚焦" },
    { name: "blur", label: "失焦" },
    { name: "clear", label: "清空" },
  ],
  render: SelectRenderer,
  renderInEditor: SelectEditorRenderer,
});
