import AvatarConfig from "./Avatar/material";
import ButtonConfig from "./Button/material";
import CardConfig from "./Card/material";
import ContainerConfig from "./Container/material";
import DividerConfig from "./Divider/material";
import FormConfig from "./Form/material";
import FormItemConfig from "./FormItem/material";
import IconConfig from "./Icon/material";
import ImageConfig from "./Image/material";
import InputConfig from "./Input/material";
import LinkConfig from "./Link/material";
import ModalConfig from "./Modal/material";
import PageConfig from "./Page/material";
import SpaceConfig from "./Space/material";
import TextConfig from "./Text/material";
import TagConfig from "./Tag/material";
import type { ComponentConfig, ComponentConfigMap } from "./types";

const builtinConfigs: ComponentConfig[] = [
  AvatarConfig,
  ButtonConfig,
  CardConfig,
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
  TagConfig,
  SpaceConfig,
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
