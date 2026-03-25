import ButtonConfig from "./Button/config";
import ContainerConfig from "./Container/config";
import DividerConfig from "./Divider/config";
import FormConfig from "./Form/config";
import FormItemConfig from "./FormItem/config";
import IconConfig from "./Icon/config";
import ImageConfig from "./Image/config";
import InputConfig from "./Input/config";
import LinkConfig from "./Link/config";
import ModalConfig from "./Modal/config";
import PageConfig from "./Page/config";
import TextConfig from "./Text/config";
import type { ComponentConfig, ComponentConfigMap } from "./types";

const builtinConfigs: ComponentConfig[] = [
  ButtonConfig,
  ContainerConfig,
  DividerConfig,
  FormConfig,
  FormItemConfig,
  IconConfig,
  ImageConfig,
  InputConfig,
  LinkConfig,
  ModalConfig,
  PageConfig,
  TextConfig,
];

export const builtinComponentConfig = builtinConfigs.reduce<ComponentConfigMap>(
  (acc, config) => {
    acc[config.name] = config;
    return acc;
  },
  {},
);

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
