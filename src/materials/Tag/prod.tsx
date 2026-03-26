import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { TagRenderer } from "./shared";


const Tag = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, text, color, disabled, target, href, icon, variant }, ref) => {
    return (
      <div 
        ref={ref} 
        data-component-id={id} 
        style={{display: "inline-block", width: "fit-content" }}
      >
        <TagRenderer
          color={color}
          disabled={disabled}
          target={target}
          href={href}
          icon={icon}
          variant={variant}
          styles={styles}
          text = {text}
          />
      </div>
    );
  },
);

export default Tag;
