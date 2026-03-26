import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { IconRenderer, normalizeIconInput } from "../Icon/shared";
import { Tag as AntdTag } from "antd"; 
function getFontSizeValue(styles?: React.CSSProperties) {
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

const Tag = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, text, color, disabled, target, href, icon, variant }, ref) => {
    const iconConfig = normalizeIconInput(icon, getFontSizeValue(styles));
    const iconNode = iconConfig?.iconName ? <IconRenderer {...iconConfig} /> : undefined;
    return (
      <div 
        ref={ref} 
        data-component-id={id} 
        style={{display: "inline-block", width: "fit-content" }}
      >
        <AntdTag
          color={color}
          disabled={disabled}
          target={target}
          href={href}
          icon={iconNode}
          variant={variant}
          style={{ display:"inline-flex", alignItems: "center", gap:"5px", ...styles }}>
          {text}
        </AntdTag>
      </div>
    );
  },
);

export default Tag;
