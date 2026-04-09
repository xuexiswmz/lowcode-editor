import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Select,
  Row,
  Space,
  Switch,
  Tag,
} from "antd";
import type { MaterialUIAdapter } from "../types";

const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const antdMaterialBindings: MaterialUIAdapter["materials"] = {
  Avatar: {
    mapProps: ({ alt, gap, icon, shape, size, src, styles }) => ({
      alt,
      gap,
      icon,
      shape,
      size: size === "medium" ? "default" : size,
      src,
      style: styles,
    }),
  },
  Button: {
    mapProps: ({ id, type, size, disabled, loading, styles, ...rest }) => ({
      ...rest,
      id: id?.toString(),
      type,
      size,
      disabled,
      loading,
      style: styles,
    }),
  },
  Card: {
    mapProps: ({ title, cover, hoverable, loading, size, variant }) => ({
      title,
      cover,
      hoverable,
      loading,
      size,
      variant,
    }),
  },
  Divider: {
    mapProps: ({ styles, dashed, plain, orientation, titlePlacement }) => ({
      style: styles,
      dashed,
      plain,
      orientation,
      titlePlacement,
    }),
  },
  Flex: {
    mapProps: ({ vertical, wrap, justify, align, flex, gap }) => ({
      vertical,
      wrap,
      justify,
      align,
      flex,
      gap,
    }),
  },
  Form: {
    useForm: Form.useForm,
    mapProps: ({ form, onFinish }) => ({
      name: "form",
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form,
      onFinish,
    }),
    mapItemProps: (item) => ({
      key: item.name,
      name: item.name,
      label: item.label,
    }),
    getFieldType: (type) => (type === "date" ? "date" : "input"),
    getPreviewInputStyle: (styles) => ({
      ...styles,
      pointerEvents: "none",
    }),
  },
  Image: {
    mapProps: ({ styles, src, alt, fallback, height, width, placeholder, preview, onError }) => ({
      style: styles,
      src,
      alt,
      fallback,
      height,
      width,
      placeholder,
      preview,
      onError,
    }),
  },
  Input: {
    mapProps: ({ styles, ...rest }) => ({
      ...rest,
      style: styles,
    }),
  },
  TextArea: {
    mapProps: ({ styles, rows, value, autoSize, ...rest }) => ({
      ...rest,
      value: typeof value === "string" ? value : String(value ?? ""),
      rows,
      autoSize:
        autoSize ??
        (typeof rows === "number"
          ? { minRows: rows, maxRows: rows }
          : undefined),
      style: {
        width: "100%",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  RadioGroup: {
    mapProps: ({ value, options, optionType, disabled, onChange, styles, ...rest }) => ({
      ...rest,
      value,
      options,
      optionType,
      disabled,
      onChange,
      style: styles,
    }),
  },
  CheckboxGroup: {
    mapProps: ({ value, options, disabled, onChange, styles, ...rest }) => ({
      ...rest,
      value,
      options,
      disabled,
      onChange,
      style: styles,
    }),
  },
  Select: {
    mapProps: ({
      value,
      options,
      mode,
      placeholder,
      disabled,
      allowClear,
      onChange,
      onSelect,
      onSearch,
      styles,
      ...rest
    }) => ({
      ...rest,
      value,
      options,
      mode,
      placeholder,
      disabled,
      allowClear,
      onChange,
      onSelect,
      onSearch,
      style: {
        minWidth: 160,
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Switch: {
    mapProps: ({
      checked,
      checkedChildren,
      unCheckedChildren,
      disabled,
      onChange,
      styles,
      ...rest
    }) => ({
      ...rest,
      checked,
      checkedChildren,
      unCheckedChildren,
      disabled,
      onChange,
      style: styles,
    }),
  },
  Modal: {
    mapProps: ({ title, open, styles, onOk, onCancel, destroyOnHidden }) => ({
      title,
      open,
      style: styles,
      onOk,
      onCancel,
      destroyOnHidden,
    }),
  },
  Col: {
    mapProps: ({ span, offset, order, flex }) => ({
      span,
      offset,
      order,
      flex,
    }),
  },
  Row: {
    mapProps: ({ gutter, justify, align, wrap }) => ({
      gutter,
      justify,
      align,
      wrap,
    }),
  },
  Space: {
    mapProps: ({ align, orientation, size, separator, wrap }) => ({
      align,
      orientation,
      size,
      separator,
      wrap,
    }),
  },
  Tag: {
    mapProps: ({ color, disabled, target, href, icon, variant, styles }) => ({
      color,
      disabled,
      target,
      href,
      icon,
      variant,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
};

export const antdMaterialUIAdapter: MaterialUIAdapter = {
  Avatar,
  Button,
  Card,
  CheckboxGroup,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  TextArea,
  RadioGroup,
  Select,
  Switch,
  Modal,
  Row,
  Space,
  Tag,
  materials: antdMaterialBindings,
};
