import React, { useState, type MouseEventHandler } from "react";
import { useComponentConfigStore } from "../stores/component-config";
import { useComponentsStore, type Component } from "../stores/components";
import HoverMask from "./HoverMask";
import SelectedMask from "./SelectedMask";

function getComponentId(path: EventTarget[]) {
  for (let i = 0; i < path.length; i += 1) {
    const ele = path[i] as HTMLElement | null;
    const componentNode = ele?.closest?.("[data-component-id]") as
      | HTMLElement
      | null;
    const componentId = componentNode?.dataset?.componentId;
    if (componentId) {
      return +componentId;
    }
  }

  return undefined;
}

export default function EditArea() {
  const { components, curComponentId, setCurComponentId } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [hoveredComponentId, setHoveredComponentId] = useState<number>();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.dev) {
        return null;
      }

      const isVoidComponent = !config.isContainer;

      if (isVoidComponent) {
        return React.createElement(config.dev, {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        });
      }

      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  }

  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();
    const componentId = getComponentId(path);

    if (componentId) {
      setHoveredComponentId(componentId);
      return;
    }

    setHoveredComponentId(undefined);
  };

  const handleMouseDown: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();
    const componentId = getComponentId(path);

    if (componentId) {
      setCurComponentId(componentId);
      return;
    }

    setCurComponentId(null);
  };

  return (
    <div
      className="edit-area lce-edit-area scrollable overflow-y-auto"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoveredComponentId(undefined)}
      onMouseDown={handleMouseDown}
    >
      {renderComponents(components)}
      {hoveredComponentId && hoveredComponentId !== curComponentId && (
        <HoverMask containerClassName="edit-area" componentId={hoveredComponentId} />
      )}
      {curComponentId && <SelectedMask containerClassName="edit-area" componentId={curComponentId} />}
      <div className="potral-wrapper"></div>
    </div>
  );
}
