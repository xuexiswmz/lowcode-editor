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
  const { updateComponentProps, mode } = useComponentsStore();
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

  // 创建包装容器，使组件在编辑模式下即使被禁用也能被选中
  const isEditMode = mode === "edit";

  return (
    <div ref={inputRef} style={{ position: "relative" }} data-component-id={id}>
      <AntdInput
        value={inputValue}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        style={styles}
        onChange={handleChange}
        {...props}
      />

      {/* 在编辑模式下，如果输入框被禁用，添加一个透明的覆盖层使其可点击 */}
      {isEditMode && disabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: "pointer",
          }}
          data-component-id={id}
        />
      )}
    </div>
  );
};

export default Input;
