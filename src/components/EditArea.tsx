import React from "react";
import { useComponentsStore, type Component } from "../stores/components";
import { useComponentConfigStore } from "../stores/component-config";

export default function EditArea() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  // useEffect(() => {
  //   addComponent(
  //     {
  //       id: 2,
  //       name: "Container",
  //       props: {},
  //       children: [],
  //     },
  //     1
  //   );
  //   addComponent(
  //     {
  //       id: 3,
  //       name: "Button",
  //       props: {
  //         text: "Click me",
  //       },
  //       children: [],
  //     },
  //     2
  //   );
  //   addComponent(
  //     {
  //       id: 4,
  //       name: "Page",
  //       props: {},
  //       children: [],
  //     },
  //     2
  //   );
  // }, []);

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
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  }

  return (
    <div className="h-[100%] scrollable overflow-y-auto">
      {renderComponents(components)}
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
    </div>
  );
}
