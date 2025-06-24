import { create } from "zustand";

export interface Component {
  id: number;
  name: string;
  props: Record<string, unknown>;
  children?: Component[];
  parentId?: number;
}

interface State {
  components: Component[];
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (
    componentId: number,
    props: Record<string, unknown>
  ) => void;
}

/**
 * Zustand store hook for managing UI components in the low-code editor.
 *
 * @remarks
 * This store provides state and actions for handling a tree of components,
 * including adding, deleting, and updating component properties.
 *
 * @returns Zustand store with the following state and actions:
 * - `components`: Array of component objects, each with `id`, `name`, `props`, `desc`, and optional `children` and `parentId`.
 * - `addComponent`: Adds a new component to the root or as a child of a specified parent.
 * - `deleteComponent`: Removes a component by its ID, handling both root and nested components.
 * - `updateComponentProps`: Updates the props of a component by its ID.
 *
 * @example
 * const { components, addComponent, deleteComponent, updateComponentProps } = useComponentsStore();
 */
export const useComponentsStore = create<State & Action>((set, get) => ({
  components: [
    {
      id: 1,
      name: "component",
      props: {},
      desc: "Component description",
    },
  ],
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components);
        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component);
          } else {
            parentComponent.children = [component];
          }
        }

        component.parentId = parentId;
        return { components: [...state.components] };
      }
      return { components: [...state.components, component] };
    }),
  deleteComponent: (componentId) => {
    if (!componentId) return;

    const component = getComponentById(componentId, get().components);
    if (component?.parentId) {
      const parentComponent = getComponentById(
        component.parentId,
        get().components
      );
      if (parentComponent) {
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        );

        set({ components: [...get().components] });
      }
    }
  },
  updateComponentProps: (componentId, props) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        component.props = { ...component.props, ...props };
        return { components: [...state.components] };
      }
      return { components: [...state.components] };
    }),
}));
export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) {
    return null;
  }

  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}
