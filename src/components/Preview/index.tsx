import React, { useRef } from "react";
import { useComponentsStore, type Component } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";
import type { ActionConfig } from "../Setting/ActionModal";
import { message } from "antd";

export default function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const componentRef = useRef<Record<string, { [key: string]: unknown }>>({});

  function handleEvent(component: Component) {
    const props: Record<string, unknown> = {};
    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];
      if (eventConfig) {
        props[event.name] = () => {
          eventConfig?.actions?.forEach((action: ActionConfig) => {
            if (action.type === "goToLink" && action.url) {
              window.location.href = action.url;
            } else if (action.type === "showMessage" && action.config) {
              if (action.config.type === "success") {
                message.success(action.config.text);
              } else if (action.config.type === "error") {
                message.error(action.config.text);
              }
            } else if (action.type === "customJS") {
              const func = new Function("context", action.code);
              func({
                name: component.name,
                props: component.props,
                showMessage(content: string) {
                  message.success(content);
                },
              });
            } else if (action.type === "componentMethod") {
              const component = componentRef.current[action.config.componentId];
              if (component) {
                if (typeof component[action.config.method] === "function") {
                  (
                    component[action.config.method] as (
                      ...args: unknown[]
                    ) => unknown
                  )();
                }
              }
            }
          });
        };
      }
    });
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ref: (ref: Record<string, unknown>) => {
            componentRef.current[component.id] = ref;
          },
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }
  return <div>{renderComponents(components)}</div>;
}
