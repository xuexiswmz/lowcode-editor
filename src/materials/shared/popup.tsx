import type { ReactNode } from "react";
import type { ImagePreviewType } from "antd/es/image";

export function findComponentContainer(id: number | string) {
  return (
    document.querySelector(
      `[data-component-id="${String(id)}"]`,
    ) as HTMLElement | null
  );
}

export function getComponentPopupContainer(triggerNode: HTMLElement) {
  return (
    (triggerNode.closest("[data-component-id]") as HTMLElement | null) ??
    document.body
  );
}

export function createComponentContainerGetter(id: number | string) {
  return () => findComponentContainer(id) ?? document.body;
}

export function wrapPopupWithComponent(
  id: number | string,
  originNode: ReactNode,
) {
  return (
    <span
      data-component-id={String(id)}
      style={{ display: "inline-block", width: "max-content" }}
    >
      {originNode}
    </span>
  );
}

export function normalizeImagePreviewConfig(
  id: number | string,
  preview: unknown,
): boolean | ImagePreviewType {
  if (!preview) {
    return false;
  }

  if (typeof preview === "object" && preview !== null) {
    return {
      ...(preview as ImagePreviewType),
      getContainer:
        (preview as ImagePreviewType).getContainer ??
        createComponentContainerGetter(id),
    };
  }

  return {
    getContainer: createComponentContainerGetter(id),
  };
}
