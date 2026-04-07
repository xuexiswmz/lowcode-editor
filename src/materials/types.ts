import type { ComponentType, LazyExoticComponent } from "react";
import type { CommonComponentProps } from "../interface";

export type MaterialComponent<T = CommonComponentProps> =
  | ComponentType<T>
  | LazyExoticComponent<ComponentType<T>>;

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  [key: string]: unknown;
}

export type componentSetter = ComponentSetter;

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentMethod {
  name: string;
  label: string;
}

export type MaterialCategory =
  | "common"
  | "navigation"
  | "layout"
  | "form"
  | "display"
  | "feedback";

export interface ComponentConfig<T = CommonComponentProps> {
  name: string;
  desc: string;
  category?: MaterialCategory;
  setter?: ComponentSetter[];
  stylesSetter?: ComponentSetter[];
  defaultProps: Record<string, unknown>;
  getDefaultProps?: () => Record<string, unknown>;
  dev: MaterialComponent<T>;
  prod: MaterialComponent<T>;
  events?: ComponentEvent[];
  methods?: ComponentMethod[];
  isContainer?: boolean;
  allowedParents?: string[];
}

export type ComponentConfigMap = Record<string, ComponentConfig>;

export interface ComponentDefinition<T = CommonComponentProps>
  extends Omit<ComponentConfig<T>, "dev" | "prod"> {
  render: MaterialComponent<T>;
  renderInEditor?: MaterialComponent<T>;
}
