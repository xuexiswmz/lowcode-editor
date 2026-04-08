import AvatarConfig from "./Avatar/material";
import ButtonConfig from "./Button/material";
import CardConfig from "./Card/material";
import ColConfig from "./Col/material";
import ContainerConfig from "./Container/material";
import DividerConfig from "./Divider/material";
import FlexConfig from "./Flex/material";
import FormConfig from "./Form/material";
import FormItemConfig from "./FormItem/material";
import IconConfig from "./Icon/material";
import ImageConfig from "./Image/material";
import InputConfig from "./Input/material";
import LinkConfig from "./Link/material";
import ModalConfig from "./Modal/material";
import PageConfig from "./Page/material";
import RadioConfig from "./Radio/material";
import RowConfig from "./Row/material";
import SpaceConfig from "./Space/material";
import TextConfig from "./Text/material";
import TagConfig from "./Tag/material";
import TextareaConfig from "./Textarea/material";
import type { ComponentConfig, ComponentConfigMap } from "./types";
export {
  getAllowedComponentNames,
  getComponentDefaultProps,
} from "./config-utils";

const builtinConfigs: ComponentConfig[] = [
  AvatarConfig,
  ButtonConfig,
  CardConfig,
  ColConfig,
  ContainerConfig,
  DividerConfig,
  FlexConfig,
  FormConfig,
  FormItemConfig,
  IconConfig,
  ImageConfig,
  InputConfig,
  LinkConfig,
  ModalConfig,
  PageConfig,
  RadioConfig,
  RowConfig,
  TextConfig,
  TagConfig,
  SpaceConfig,
  TextareaConfig,
];

export const builtinComponentConfig = builtinConfigs.reduce<ComponentConfigMap>(
  (acc, config) => {
    acc[config.name] = config;
    return acc;
  },
  {},
);
