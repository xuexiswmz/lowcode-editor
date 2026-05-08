import type { ComponentType, LazyExoticComponent } from "react";
import type { CommonComponentProps } from "../interface";

export type MaterialComponent<T = CommonComponentProps> =
  | ComponentType<T>
  | LazyExoticComponent<ComponentType<T>>;

export interface SetterOption {
  label: string;
  value: string;
}

export interface SetterCollectionMeta {
  kind: "flat" | "tree" | "table";
  definition?: string;
}

export interface ComponentPropsAdapter {
  toFormValues?: (
    props: Record<string, unknown>,
    defaultProps: Record<string, unknown>,
  ) => Record<string, unknown>;
  fromFormPatch?: (
    patch: Record<string, unknown>,
    prevProps: Record<string, unknown>,
    defaultProps: Record<string, unknown>,
  ) => Record<string, unknown>;
}

export interface SetterContext {
  setting: ComponentSetter;
  componentName: string;
  currentProps: Record<string, unknown>;
  config?: ComponentConfig;
}

export type SetterResolver<T> = (context: SetterContext) => T;

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  options?: SetterOption[];
  props?: Record<string, unknown> | SetterResolver<Record<string, unknown>>;
  visible?: boolean | SetterResolver<boolean>;
  disabled?: boolean | SetterResolver<boolean>;
  deriveOptions?: SetterResolver<SetterOption[]>;
  collection?: SetterCollectionMeta;
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
  propsAdapter?: ComponentPropsAdapter;
}

export type ComponentConfigMap = Record<string, ComponentConfig>;

export interface ComponentDefinition<T = CommonComponentProps>
  extends Omit<ComponentConfig<T>, "dev" | "prod"> {
  render: MaterialComponent<T>;
  renderInEditor?: MaterialComponent<T>;
}
