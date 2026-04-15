import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { getComponentById, useComponentsStore } from "../../stores/components";
import { useMaskPosition } from "../useMaskPosition";

interface HoverMaskProps {
  containerClassName: string;
  componentId: number;
}

function HoverMask({ containerClassName, componentId }: HoverMaskProps) {
  const { components } = useComponentsStore();
  const position = useMaskPosition(containerClassName, componentId, [components]);

  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = `wrapper`;

    const container = document.querySelector(`.${containerClassName}`);
    if (container) {
      container.appendChild(el);
    }
    return el;
  }, [containerClassName]);

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId, components]);
  useEffect(() => {
    return () => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [el]);
  if (!el) return null;

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
          border: "1px dashed blue",
          pointerEvents: "none",
          zIndex: 12,
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: position.labelTop,
          left: position.labelLeft,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform:
            position.labelPlacement === "top"
              ? "translate(-100%,-100%)"
              : "translate(-100%,0)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "0 8px",
            backgroundColor: "blue",
            color: "#fff",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {curComponent?.desc}
        </div>
      </div>
    </>,
    el
  );
}

export default HoverMask;
