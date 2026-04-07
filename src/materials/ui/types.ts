import type {
  Avatar as AntdAvatar,
  Button as AntdButton,
  Card as AntdCard,
  DatePicker as AntdDatePicker,
  Divider as AntdDivider,
  Flex as AntdFlex,
  Form as AntdForm,
  Image as AntdImage,
  Input as AntdInput,
  Modal as AntdModal,
  Col as AntdCol,
  Row as AntdRow,
  Space as AntdSpace,
  Tag as AntdTag,
  InputRef,
} from "antd";
import type { CSSProperties } from "react";

export type MaterialRenderMode = "preview" | "editor";

export interface MaterialBindingContext {
  mode?: MaterialRenderMode;
}

export interface FormSchemaItem {
  label?: string;
  name?: string;
  type?: string;
  id?: number;
}

export interface MaterialBindings {
  Avatar: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Button: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Card: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Divider: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Flex: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Form: {
    useForm: typeof AntdForm.useForm;
    mapProps: (
      props: {
        form: unknown;
        onFinish?: (values: Record<string, unknown>) => void;
      },
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
    mapItemProps: (
      item: FormSchemaItem,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
    getFieldType: (
      type?: string,
      context?: MaterialBindingContext,
    ) => "input" | "date";
    getPreviewInputStyle: (
      styles?: CSSProperties,
      context?: MaterialBindingContext,
    ) => CSSProperties;
  };
  Image: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Input: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Modal: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Col: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Row: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Space: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Tag: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
}

export interface MaterialUIAdapter {
  Avatar: typeof AntdAvatar;
  Button: typeof AntdButton;
  Card: typeof AntdCard;
  DatePicker: typeof AntdDatePicker;
  Divider: typeof AntdDivider;
  Flex: typeof AntdFlex;
  Form: typeof AntdForm;
  Image: typeof AntdImage;
  Input: typeof AntdInput;
  Modal: typeof AntdModal;
  Col: typeof AntdCol;
  Row: typeof AntdRow;
  Space: typeof AntdSpace;
  Tag: typeof AntdTag;
  materials: MaterialBindings;
}

export type MaterialInputRef = InputRef;
