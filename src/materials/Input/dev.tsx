import { Input as AntdInput } from "antd";
import { useDrag } from "react-dnd";
import { useRef, useEffect, useState, useCallback } from "react";
import type { CommonComponentProps } from "../../interface";
import { useComponentsStore } from "../../stores/components";
import { debounce } from "lodash-es";

// 定义Input组件的属性，排除children属性
type InputProps = Omit<CommonComponentProps, "children">;

const Input = ({
  id,
  value = "",
  placeholder = "请输入内容",
  onChange,
  styles,
  type,
  disabled = false,
  maxLength,
  name = "Input",
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLDivElement>(null);
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
      console.log("updateComponentProps", newValue);
    }, 200),
    [id, updateComponentProps]
  );

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  useEffect(() => {
    drag(inputRef);
  }, [drag]);

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
    <div ref={inputRef}>
      <AntdInput
        data-component-id={id}
        value={inputValue}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        style={styles}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default Input;
