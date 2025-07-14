import { Button as AntdButton } from "antd";
import type { CommonComponentProps } from "../../interface";
import { forwardRef } from "react";
const Button = forwardRef<HTMLButtonElement, CommonComponentProps>(
  (
    {
      id,
      type,
      text,
      styles,
      size = "middle",
      disabled = false,
      loading = false,
      ...props
    },
    ref
  ) => {
    return (
      <AntdButton
        ref={ref}
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
  }
);

export default Button;
