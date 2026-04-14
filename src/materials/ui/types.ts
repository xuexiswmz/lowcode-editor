import type {
  Avatar as AntdAvatar,
  Breadcrumb as AntdBreadcrumb,
  Button as AntdButton,
  Card as AntdCard,
  Checkbox as AntdCheckbox,
  DatePicker as AntdDatePicker,
  Divider as AntdDivider,
  Flex as AntdFlex,
  Form as AntdForm,
  Image as AntdImage,
  Input as AntdInput,
  Modal as AntdModal,
  Radio as AntdRadio,
  Select as AntdSelect,
  Steps as AntdSteps,
  Upload as AntdUpload,
  Col as AntdCol,
  Row as AntdRow,
  Space as AntdSpace,
  Switch as AntdSwitch,
  Tag as AntdTag,
  InputRef,
} from "antd";
import type { TextAreaRef } from "antd/es/input/TextArea";
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
  Breadcrumb: {
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
  DatePicker: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Steps: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Upload: {
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
  TextArea: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  RadioGroup: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  CheckboxGroup: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Select: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Switch: {
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
  Breadcrumb: typeof AntdBreadcrumb;
  Button: typeof AntdButton;
  Card: typeof AntdCard;
  DatePicker: typeof AntdDatePicker;
  Divider: typeof AntdDivider;
  Flex: typeof AntdFlex;
  Form: typeof AntdForm;
  Image: typeof AntdImage;
  Input: typeof AntdInput;
  TextArea: typeof AntdInput.TextArea;
  RadioGroup: typeof AntdRadio.Group;
  CheckboxGroup: typeof AntdCheckbox.Group;
  Select: typeof AntdSelect;
  Steps: typeof AntdSteps;
  Upload: typeof AntdUpload;
  Switch: typeof AntdSwitch;
  Modal: typeof AntdModal;
  Col: typeof AntdCol;
  Row: typeof AntdRow;
  Space: typeof AntdSpace;
  Tag: typeof AntdTag;
  materials: MaterialBindings;
}

export type MaterialInputRef = InputRef;
export type MaterialTextAreaRef = TextAreaRef;
