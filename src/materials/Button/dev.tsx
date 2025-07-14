import { Button as AntdButton } from "antd";
import type { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
import { useComponentsStore } from "../../stores/components";

const Button = ({
  id,
  type,
  text,
  styles,
  size = "middle",
  disabled = false,
  loading = false,
}: CommonComponentProps) => {
  const { mode } = useComponentsStore();
  const [, drag] = useDrag({
    type: "Button",
    item: {
      type: "Button",
      dragType: "move",
      id,
    },
  });

  // 创建包装容器，使组件在编辑模式下即使被禁用也能被选中
  const isEditMode = mode === "edit";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
      ref={drag}
      data-component-id={id}
    >
      <AntdButton
        type={type}
        size={size}
        disabled={disabled}
        loading={loading}
        style={styles}
      >
        {text}
      </AntdButton>

      {/* 在编辑模式下，如果按钮被禁用，添加一个透明的覆盖层使其可点击 */}
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

export default Button;
