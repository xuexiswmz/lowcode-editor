import type {
  Alert as AntdAlert,
  Avatar as AntdAvatar,
  Badge as AntdBadge,
  Breadcrumb as AntdBreadcrumb,
  Button as AntdButton,
  Card as AntdCard,
  Checkbox as AntdCheckbox,
  DatePicker as AntdDatePicker,
  Descriptions as AntdDescriptions,
  Dropdown as AntdDropdown,
  Divider as AntdDivider,
  Flex as AntdFlex,
  Form as AntdForm,
  Image as AntdImage,
  Input as AntdInput,
  List as AntdList,
  Spin as AntdSpin,
  Tree as AntdTree,
  Table as AntdTable,
  Menu as AntdMenu,
  Modal as AntdModal,
  Progress as AntdProgress,
  Radio as AntdRadio,
  Select as AntdSelect,
  Steps as AntdSteps,
  Tabs as AntdTabs,
  Tooltip as AntdTooltip,
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
  Alert: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Avatar: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Badge: {
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
  Descriptions: {
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
  Dropdown: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Tooltip: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Tabs: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Menu: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Progress: {
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
  List: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Spin: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Table: {
    mapProps: (
      props: Record<string, unknown>,
      context?: MaterialBindingContext,
    ) => Record<string, unknown>;
  };
  Tree: {
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
  Alert: typeof AntdAlert;
  Avatar: typeof AntdAvatar;
  Badge: typeof AntdBadge;
  Breadcrumb: typeof AntdBreadcrumb;
  Button: typeof AntdButton;
  Card: typeof AntdCard;
  DatePicker: typeof AntdDatePicker;
  Descriptions: typeof AntdDescriptions;
  Divider: typeof AntdDivider;
  Flex: typeof AntdFlex;
  Form: typeof AntdForm;
  Image: typeof AntdImage;
  Input: typeof AntdInput;
  List: typeof AntdList;
  Spin: typeof AntdSpin;
  Tree: typeof AntdTree;
  Table: typeof AntdTable;
  TextArea: typeof AntdInput.TextArea;
  RadioGroup: typeof AntdRadio.Group;
  CheckboxGroup: typeof AntdCheckbox.Group;
  Select: typeof AntdSelect;
  Steps: typeof AntdSteps;
  Dropdown: typeof AntdDropdown;
  Tooltip: typeof AntdTooltip;
  Tabs: typeof AntdTabs;
  Menu: typeof AntdMenu;
  Upload: typeof AntdUpload;
  Switch: typeof AntdSwitch;
  Modal: typeof AntdModal;
  Progress: typeof AntdProgress;
  Col: typeof AntdCol;
  Row: typeof AntdRow;
  Space: typeof AntdSpace;
  Tag: typeof AntdTag;
  materials: MaterialBindings;
}

export type MaterialInputRef = InputRef;
export type MaterialTextAreaRef = TextAreaRef;
