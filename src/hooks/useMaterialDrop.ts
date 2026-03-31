import { useMemo } from "react";
import { useDrop } from "react-dnd";
import {
  getAllowedComponentNames,
  getComponentDefaultProps,
} from "../materials/config-utils";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponentsStore } from "../stores/components";

export interface ItemType {
  type: string;
  dragType?: "move" | "add";
  id: number;
}

export function useMaterialDrop(id: number) {
  const { addComponent, components, deleteComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const currentComponent = getComponentById(id, components);
  const accept = useMemo(
    () => getAllowedComponentNames(componentConfig, currentComponent?.name),
    [componentConfig, currentComponent?.name],
  );

  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept,
      canDrop: () => accept.length > 0,
      drop: (item: ItemType, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (item.dragType === "move") {
          // move
          const component = getComponentById(item.id, components)!;
          deleteComponent(item.id);
          addComponent(component, id);
        } else {
          // add
          const config = componentConfig[item.type];
          addComponent(
            {
              id: new Date().getTime(),
              name: item.type,
              desc: config.desc,
              props: getComponentDefaultProps(config),
              styles: {},
            },
            id,
          );
        }
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
      }),
    }),
    [accept, addComponent, componentConfig, components, deleteComponent, id],
  );
  return { canDrop, drop };
}
