import { Button as AntdButton } from "antd";
import type { CommonComponentProps } from "../../interface";
const Button = ({ id, type, text, styles, ...props }: CommonComponentProps) => {
  return (
    <AntdButton type={type} style={styles} {...props} id={id?.toString()}>
      {text}
    </AntdButton>
  );
};

export default Button;
