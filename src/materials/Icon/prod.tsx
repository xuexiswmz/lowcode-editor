import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { IconRenderer } from "./shared";

const Icon = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles, source, iconName, localPath, size, spin, rotate }, ref) => {
    return (
      <div
        ref={ref}
        data-component-id={id}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          ...styles,
        }}
      >
        <IconRenderer
          source={source}
          iconName={iconName}
          localPath={localPath}
          size={size}
          spin={spin}
          rotate={rotate}
        />
      </div>
    );
  },
);

export default Icon;
