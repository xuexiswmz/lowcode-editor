import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getComponentById, useComponentsStore } from "../../stores/components";

interface HoverMaskProps {
  containerClassName: string;
  componentId: number;
}

function HoverMask({ containerClassName, componentId }: HoverMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });
  const { components } = useComponentsStore();
  useEffect(() => {
    updatePosition();
  }, [componentId]);
  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;
    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollLeft,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

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
  }, [componentId]);
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
          backgroundColor: "rgba(0, 0, 255, 0.1)",
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
          transform: "translate(-100%,-100%)",
        }}
      >
        <div
          style={{
            padding: "0 8px",
            backgroundColor: "blue",
            color: "#fff",
            borderRadius: 4,
            whiteSpace: "nowrap",
            cursor: "pointer",
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
