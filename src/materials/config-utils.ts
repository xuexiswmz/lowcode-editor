import type { ComponentConfig, ComponentConfigMap } from "./types";

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
