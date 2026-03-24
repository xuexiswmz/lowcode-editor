import type { ComponentConfig, ComponentConfigMap } from "./types";

const configModules = import.meta.glob<{ default: ComponentConfig }>(
  "./*/config.tsx",
  { eager: true },
);

export const builtinComponentConfig = Object.values(configModules).reduce<
  ComponentConfigMap
>((acc, module) => {
  const config = module.default;
  acc[config.name] = config;
  return acc;
}, {});

export function getComponentDefaultProps(config: ComponentConfig) {
  return {
    ...config.defaultProps,
    ...config.getDefaultProps?.(),
  };
}

export function getAllowedComponentNames(
  componentConfig: ComponentConfigMap,
  parentName?: string,
) {
  if (!parentName) {
    return [];
  }

  return Object.values(componentConfig)
    .filter(
      (item) => item.name !== "Page" && item.allowedParents?.includes(parentName),
    )
    .map((item) => item.name);
}
