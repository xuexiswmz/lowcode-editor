import { forwardRef } from "react";
import { TEXTAREA_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { TextArea, materials, type MaterialTextAreaRef } from "../ui";
import type { InputProps } from "../Input/material";
import { useManagedInputValue } from "../Input/shared";

type TextareaProps = Omit<InputProps, "type"> & {
  rows?: number;
};

const TextareaRenderer = forwardRef<MaterialTextAreaRef, TextareaProps>(
  (
    {
      id,
      value = "",
      placeholder = "请输入内容",
      onChange,
      styles,
      disabled = false,
      maxLength,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const { inputValue, setInputValue, debouncedUpdateValue } =
      useManagedInputValue(id, value);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = e.target.value;

      if (maxLength && nextValue.length > maxLength) {
        return;
      }

      setInputValue(nextValue);
      debouncedUpdateValue(nextValue);
      onChange?.(e);
    };

    return (
      <TextArea
        ref={ref}
        {...materials.TextArea.mapProps(
          {
            "data-component-id": id,
            value: inputValue,
            placeholder,
            onChange: handleChange,
            styles,
            disabled,
            maxLength,
            rows,
            autoSize: {
              minRows: rows,
              maxRows: rows,
            },
            ...props,
          },
          { mode: "preview" },
        )}
      />
    );
  },
);

const TextareaEditorRenderer = forwardRef<HTMLDivElement, TextareaProps>(
  (
    {
      id,
      value = "",
      placeholder = "请输入内容",
      onChange,
      styles,
      disabled = false,
      maxLength,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const { inputValue, setInputValue, debouncedUpdateValue } =
      useManagedInputValue(id, value);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <TextArea
          {...materials.TextArea.mapProps(
            {
              value: inputValue,
              placeholder,
              disabled,
              maxLength,
              rows,
              autoSize: {
                minRows: rows,
                maxRows: rows,
              },
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

TextareaRenderer.displayName = "TextareaRenderer";
TextareaEditorRenderer.displayName = "TextareaEditorRenderer";

export default createLeafMaterial({
  name: "Textarea",
  category: "form",
  desc: "多行输入",
  defaultProps: {
    value: "",
    placeholder: "请输入内容",
    rows: 4,
    disabled: false,
    maxLength: 200,
  },
  allowedParents: [...TEXTAREA_ALLOWED_PARENTS],
  setter: [
    field.input("value", "值"),
    field.input("placeholder", "占位符"),
    field.inputNumber("rows", "行数"),
    field.switch("disabled", "禁用"),
    field.inputNumber("maxLength", "最大长度"),
  ],
  events: [
    { name: "onChange", label: "值变化事件" },
    { name: "onFocus", label: "聚焦事件" },
    { name: "onBlur", label: "失焦事件" },
  ],
  methods: [
    { name: "focus", label: "聚焦" },
    { name: "blur", label: "失焦" },
  ],
  render: TextareaRenderer,
  renderInEditor: TextareaEditorRenderer,
});
