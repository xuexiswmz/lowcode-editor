import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { INPUT_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Input, materials, type MaterialInputRef } from "../ui";
import type { SetterContext } from "../types";
import { useManagedInputValue } from "./shared";

export type InputProps = Omit<CommonComponentProps, "children">;

const inputTypeOptions = [
  { label: "文本", value: "text" },
  { label: "密码", value: "password" },
  { label: "数字", value: "number" },
  { label: "邮箱", value: "email" },
  { label: "电话", value: "tel" },
  { label: "搜索", value: "search" },
  { label: "网址", value: "url" },
];

const InputRenderer = forwardRef<MaterialInputRef, InputProps>(
  (
    {
      id,
      value = "",
      placeholder = "请输入内容",
      onChange,
      styles,
      type,
      disabled = false,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const { inputValue, setInputValue, debouncedUpdateValue } =
      useManagedInputValue(id, value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;

      if (maxLength && nextValue.length > maxLength) {
        return;
      }

      setInputValue(nextValue);
      debouncedUpdateValue(nextValue);
      onChange?.(e);
    };

    return (
      <Input
        ref={ref}
        {...materials.Input.mapProps(
          {
            dataComponentId: id,
            "data-component-id": id,
            value: inputValue,
            placeholder,
            onChange: handleChange,
            styles,
            type,
            disabled,
            maxLength,
            ...props,
          },
          { mode: "preview" },
        )}
      />
    );
  },
);

const InputEditorRenderer = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      id,
      value = "",
      placeholder = "请输入内容",
      onChange,
      styles,
      type,
      disabled = false,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const { inputValue, setInputValue, debouncedUpdateValue } =
      useManagedInputValue(id, value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;

      if (maxLength && nextValue.length > maxLength) {
        return;
      }

      setInputValue(nextValue);
      debouncedUpdateValue(nextValue);
      onChange?.(e);
    };

    return (
      <div ref={ref} style={{ position: "relative" }} data-component-id={id}>
        <Input
          {...materials.Input.mapProps(
            {
              value: inputValue,
              type,
              placeholder,
              disabled,
              maxLength,
              styles,
              onChange: handleChange,
              ...props,
            },
            { mode: "editor" },
          )}
        />
        {disabled ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              cursor: "pointer",
            }}
            data-component-id={id}
          />
        ) : null}
      </div>
    );
  },
);

InputRenderer.displayName = "InputRenderer";
InputEditorRenderer.displayName = "InputEditorRenderer";

export default createLeafMaterial({
  name: "Input",
  category: "form",
  desc: "输入框",
  defaultProps: {
    value: "",
    placeholder: "请输入内容",
    disabled: false,
    maxLength: 10,
    type: "text",
  },
  allowedParents: [...INPUT_ALLOWED_PARENTS],
  setter: [
    field.input("value", "值", {
      props: ({ currentProps, config }: SetterContext) => ({
        maxLength:
          (currentProps.maxLength as number | undefined) ??
          (config?.defaultProps?.maxLength as number | undefined),
      }),
    }),
    field.input("placeholder", "占位符"),
    field.switch("disabled", "禁用"),
    field.inputNumber("maxLength", "最大长度"),
    field.select("type", "类型", inputTypeOptions),
  ],
  events: [
    { name: "onChange", label: "值变化事件" },
    { name: "onFocus", label: "聚焦事件" },
    { name: "onBlur", label: "失焦事件" },
  ],
  render: InputRenderer,
  renderInEditor: InputEditorRenderer,
});
