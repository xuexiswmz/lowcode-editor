import { create } from "zustand";
import { builtinComponentConfig } from "../materials/registry";
import type { ComponentConfig, ComponentConfigMap } from "../materials/types";

export type {
  ComponentConfig,
  ComponentEvent,
  ComponentMethod,
  ComponentSetter,
  componentSetter,
} from "../materials/types";

interface State {
  componentConfig: ComponentConfigMap;
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
  syncBuiltinComponentConfig: (componentConfig: ComponentConfigMap) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: { ...builtinComponentConfig },
  registerComponent: (name, componentConfig) =>
    set((state) => ({
      ...state,
      componentConfig: {
        ...state.componentConfig,
        [name]: componentConfig,
      },
    })),
  syncBuiltinComponentConfig: (nextBuiltinConfig) =>
    set((state) => {
      const customConfig = Object.fromEntries(
        Object.entries(state.componentConfig).filter(
          ([name]) => !(name in nextBuiltinConfig),
        ),
      );

      return {
        componentConfig: {
          ...nextBuiltinConfig,
          ...customConfig,
        },
      };
    }),
}));

if (import.meta.hot) {
  import.meta.hot.accept("../materials/registry", (newModule) => {
    if (!newModule) {
      return;
    }

    useComponentConfigStore
      .getState()
      .syncBuiltinComponentConfig(newModule.builtinComponentConfig);
  });
}
