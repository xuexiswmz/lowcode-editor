import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { AvatarRenderer } from "./shared";

const Avatar = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, alt, gap, icon, shape, size, src, text }, ref) => {
    return (
      <div
        ref={ref}
        data-component-id={id}
        style={{ display: "inline-block", width: "fit-content" }}
      >
        <AvatarRenderer
          alt={alt}
          gap={gap}
          icon={icon}
          shape={shape}
          size={size}
          src={src}
          styles={styles}
          text={text}
        />
      </div>
    );
  },
);

export default Avatar;
