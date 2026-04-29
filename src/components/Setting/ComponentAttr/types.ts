import type { ComponentType } from "react";
import type { ChoiceOption } from "../../../materials/shared/choice";
import type { MenuItemConfig } from "../../../materials/shared/menu";
import type {
  ComponentConfig,
  componentSetter,
} from "../../../stores/component-config";

export interface SetterInputProps<TValue = unknown> {
  value?: TValue;
  onChange?: (value: TValue) => void;
}

export type OptionItem = ChoiceOption;

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface StepItem {
  title: string;
  description?: string;
}

export interface TabsItem {
  key: string;
  label: string;
  children?: string;
  disabled?: boolean;
}

export interface DropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export type EditableMenuItem = MenuItemConfig;

export interface DescriptionItem {
  key: string;
  label: string;
  children: string;
  span?: number;
}

export interface ListDataItem {
  key: string;
  title: string;
  description?: string;
  extra?: string;
}

export interface TableColumnItem {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  align?: "left" | "center" | "right";
  ellipsis?: boolean;
  renderType?: "text" | "index" | "custom";
  template?: string;
}

export interface TableActionItem {
  key: string;
  label: string;
  type?: "text" | "button";
  buttonType?: "default" | "primary" | "link";
  danger?: boolean;
  disabled?: boolean;
}

export interface TreeNodeItem {
  key: string;
  title: string;
  disabled?: boolean;
  children?: TreeNodeItem[];
}

export type TableDataRow = Record<string, unknown>;

export interface SetterRendererProps<TValue = unknown>
  extends SetterInputProps<TValue> {
  setting: componentSetter;
  componentName: string;
  currentProps: Record<string, unknown>;
  config?: ComponentConfig;
}

export type SetterRenderer = ComponentType<SetterRendererProps>;
