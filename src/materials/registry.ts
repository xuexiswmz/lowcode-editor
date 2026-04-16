import AvatarConfig from "./Avatar/material";
import BreadcrumbConfig from "./Breadcrumb/material";
import ButtonConfig from "./Button/material";
import CardConfig from "./Card/material";
import CheckboxConfig from "./Checkbox/material";
import ColConfig from "./Col/material";
import ContainerConfig from "./Container/material";
import DatePickerConfig from "./DatePicker/material";
import DividerConfig from "./Divider/material";
import DropdownConfig from "./Dropdown/material";
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
import SelectConfig from "./Select/material";
import SpaceConfig from "./Space/material";
import StepsConfig from "./Steps/material";
import SwitchConfig from "./Switch/material";
import TabsConfig from "./Tabs/material";
import TextConfig from "./Text/material";
import TagConfig from "./Tag/material";
import TextareaConfig from "./Textarea/material";
import UploadConfig from "./Upload/material";
import type { ComponentConfig, ComponentConfigMap } from "./types";
export {
  getAllowedComponentNames,
  getComponentDefaultProps,
} from "./config-utils";

const builtinConfigs: ComponentConfig[] = [
  AvatarConfig,
  BreadcrumbConfig,
  ButtonConfig,
  CardConfig,
  CheckboxConfig,
  ColConfig,
  ContainerConfig,
  DatePickerConfig,
  DividerConfig,
  DropdownConfig,
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
  SelectConfig,
  TextConfig,
  TagConfig,
  SpaceConfig,
  StepsConfig,
  SwitchConfig,
  TabsConfig,
  TextareaConfig,
  UploadConfig,
];

export const builtinComponentConfig = builtinConfigs.reduce<ComponentConfigMap>(
  (acc, config) => {
    acc[config.name] = config;
    return acc;
  },
  {},
);
