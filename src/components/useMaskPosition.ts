import { useEffect, useRef, useState } from "react";

export type MaskLabelPlacement = "top" | "bottom";

export interface MaskPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  labelTop: number;
  labelLeft: number;
  labelPlacement: MaskLabelPlacement;
}

export const EMPTY_MASK_POSITION: MaskPosition = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  labelTop: 0,
  labelLeft: 0,
  labelPlacement: "top",
};

export function useMaskPosition(
  containerClassName: string,
  componentId: number,
  deps: readonly unknown[],
) {
  const [position, setPosition] = useState(EMPTY_MASK_POSITION);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    updatePosition();
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [componentId, ...deps]);

  useEffect(() => {
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const handleChange = () => updatePosition();
    const resizeObserver = new ResizeObserver(handleChange);

    resizeObserver.observe(container);
    container.addEventListener("scroll", handleChange);
    window.addEventListener("resize", handleChange);

    return () => {
      container.removeEventListener("scroll", handleChange);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleChange);
    };
  }, [containerClassName, componentId, ...deps]);

  function updatePosition() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (!componentId) return;

      const container = document.querySelector(`.${containerClassName}`);
      if (!container) return;

      const node = container.querySelector(`[data-component-id="${componentId}"]`);

      if (!node) {
        setPosition(EMPTY_MASK_POSITION);
        return;
      }

      const { top, left, width, height } = node.getBoundingClientRect();
      const { top: containerTop, left: containerLeft } =
        container.getBoundingClientRect();

      const relativeTop = top - containerTop + container.scrollTop;
      const relativeLeft = left - containerLeft + container.scrollLeft;
      const labelPlacement = relativeTop <= 36 ? "bottom" : "top";

      setPosition({
        top: relativeTop,
        left: relativeLeft,
        width,
        height,
        labelTop: labelPlacement === "top" ? relativeTop : relativeTop + height + 4,
        labelLeft: left - containerLeft + width,
        labelPlacement,
      });
    });
  }

  return position;
}
