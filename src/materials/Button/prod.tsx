import { Button as AntdButton } from "antd";
import type { CommonComponentProps } from "../../interface";
const Button = ({
  id,
  type,
  text,
  styles,
  size = "middle",
  disabled = false,
  loading = false,
  ...props
}: CommonComponentProps) => {
  return (
    <AntdButton
      type={type}
      size={size}
      disabled={disabled}
      loading={loading}
      style={styles}
      {...props}
      id={id?.toString()}
    >
      {text}
    </AntdButton>
  );
};

export default Button;
