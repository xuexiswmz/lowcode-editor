import { useDrag } from "react-dnd";
import { Tag as AntdTag } from "antd";
import type { CSSProperties } from "react";
import type { CommonComponentProps } from "../../interface";
import { IconRenderer, normalizeIconInput } from "../Icon/shared";

function getFontSizeValue(styles?: CSSProperties) {
  const fontSize = styles?.fontSize;

  if (typeof fontSize === "number") {
    return fontSize;
  }

  if (typeof fontSize === "string") {
    const parsed = Number.parseFloat(fontSize);
    return Number.isNaN(parsed) ? 12 : parsed;
  }

  return 12;
}

export default function Tag({
  id,
  name,
  styles,
  text,
  color,
  disabled,
  target,
  href,
  icon,
  variant,
}: CommonComponentProps) {
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  const iconConfig = normalizeIconInput(icon, getFontSizeValue(styles));
  const iconNode = iconConfig?.iconName ? <IconRenderer {...iconConfig} /> : undefined;

  return (
    <div
      ref={drag}
      data-component-id={id}
      style={{ display: "inline-block", width: "fit-content" }}
      >
      <AntdTag
        color={color}
        disabled={disabled}
        target={target}
        href={href}
        icon={iconNode}
        variant={variant}
        style={{ display:"inline-flex", alignItems: "center", gap:"5px", ...styles }}
      >
        {text}
      </AntdTag>
    </div>
  );
}
