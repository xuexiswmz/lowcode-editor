import React, { useState, type MouseEventHandler } from "react";
import { useComponentsStore, type Component } from "../stores/components";
import { useComponentConfigStore } from "../stores/component-config";
import HoverMask from "./HoverMask";
import SelectedMask from "./SelectedMask";

export default function EditArea() {
  const { components, curComponentId, setCurComponentId } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [hoveredComponentId, setHoveredComponentId] = useState<number>();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.component) {
        return null;
      }
      return React.createElement(
        config.component,
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
      className="h-[100%] scrollable overflow-y-auto edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoveredComponentId(undefined)}
      onClick={handleClick}
    >
      {renderComponents(components)}
      {hoveredComponentId && hoveredComponentId !== curComponentId && (
        <HoverMask
          containerClassName="edit-area"
          componentId={hoveredComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          containerClassName="edit-area"
          componentId={curComponentId}
        />
      )}
      <div className="potral-wrapper"></div>
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
    </div>
  );
}
