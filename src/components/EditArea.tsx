import React, { useState, type MouseEventHandler } from "react";
import { useComponentConfigStore } from "../stores/component-config";
import { useComponentsStore, type Component } from "../stores/components";
import HoverMask from "./HoverMask";
import SelectedMask from "./SelectedMask";

const VOID_COMPONENTS = ["Input"];

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

      const isVoidComponent = VOID_COMPONENTS.includes(component.name);

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
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;
      const componentId = ele.dataset.componentId;
      if (componentId) {
        setHoveredComponentId(+componentId);
        return;
      }
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;
      const componentId = ele.dataset.componentId;
      if (componentId) {
        setCurComponentId(+componentId);
        return;
      }
    }
  };

  return (
    <div
      className="edit-area lce-edit-area scrollable overflow-y-auto"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoveredComponentId(undefined)}
      onClick={handleClick}
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
