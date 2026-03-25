import type { ComponentType } from "react";
import type { CommonComponentProps } from "../interface";

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
  dev: ComponentType<T>;
  prod: ComponentType<T>;
  events?: ComponentEvent[];
  methods?: ComponentMethod[];
  isContainer?: boolean;
  allowedParents?: string[];
}

export type ComponentConfigMap = Record<string, ComponentConfig>;
