import { Input as AntdInput } from "antd";
import type { CommonComponentProps } from "../../interface";
import { forwardRef, useState, useEffect, useCallback } from "react";
import type { InputRef } from "antd/lib/input";
import { useComponentsStore } from "../../stores/components";
import { debounce } from "lodash-es";

// 定义Input组件的属性，排除children属性
type InputProps = Omit<CommonComponentProps, "children">;

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      id,
      value,
      placeholder = "请输入内容",
      onChange,
      styles,
      type,
      disabled = false,
      maxLength,
      ...props
    },
    ref
  ) => {
    const { updateComponentProps } = useComponentsStore();
    const [inputValue, setInputValue] = useState(value);

    // 当外部value属性变化时更新内部状态
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdateProps = useCallback(
      debounce((newValue: string) => {
        updateComponentProps(id, { value: newValue });
      }, 200),
      [id, updateComponentProps]
    );

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setInputValue(newValue);

      debouncedUpdateProps(newValue);

      if (onChange) {
        onChange(e);
      }
    };

    return (
      <AntdInput
        ref={ref}
        data-component-id={id}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        style={styles}
        type={type}
        disabled={disabled}
        maxLength={maxLength}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
