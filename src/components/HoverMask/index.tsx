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

  useEffect(() => {
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    // 创建 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      // 使用 setTimeout 确保 DOM 更新后再计算位置
      setTimeout(() => {
        updatePosition();
      }, 10);
    });

    // 监听容器大小变化
    resizeObserver.observe(container);

    // 同时保留原有的窗口大小变化监听
    window.addEventListener("resize", updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
    };
  }, [containerClassName]);

  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    // 确保使用正确的组件ID进行查询，避免选择错误的组件
    const selector = `[data-component-id="${componentId}"]`;
    const node = document.querySelector(selector);

    if (!node) {
      console.log(`未找到组件: ${selector}`);
      return;
    }

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
