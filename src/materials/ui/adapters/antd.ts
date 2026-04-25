import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Dropdown,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  List,
  Popover,
  Spin,
  Tree,
  Table,
  Menu,
  Modal,
  Progress,
  Radio,
  Select,
  Row,
  Space,
  Steps,
  Switch,
  Tabs,
  Tooltip,
  Tag,
  Upload,
} from "antd";
import type { MaterialUIAdapter } from "../types";

const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const antdMaterialBindings: MaterialUIAdapter["materials"] = {
  Alert: {
    mapProps: ({
      message,
      description,
      type,
      closable,
      showIcon,
      banner,
      onClose,
      styles,
      ...rest
    }) => ({
      ...rest,
      message,
      description,
      type,
      closable,
      showIcon,
      banner,
      onClose,
      style: {
        width: "100%",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
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
  Badge: {
    mapProps: ({
      count,
      status,
      text,
      color,
      dot,
      overflowCount,
      offset,
      styles,
      ...rest
    }) => ({
      ...rest,
      count,
      status,
      text,
      color,
      dot,
      overflowCount,
      offset,
      style: {
        display: "inline-flex",
        alignItems: "center",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Breadcrumb: {
    mapProps: ({ items, separator, styles, ...rest }) => ({
      ...rest,
      items,
      separator,
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
  DatePicker: {
    mapProps: ({
      value,
      picker,
      format,
      placeholder,
      disabled,
      onChange,
      onOpenChange,
      styles,
      ...rest
    }) => ({
      ...rest,
      value,
      picker,
      format,
      placeholder,
      disabled,
      onChange,
      onOpenChange,
      style: {
        width: "100%",
        minWidth: 160,
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Descriptions: {
    mapProps: ({ items, title, column, bordered, size, styles, ...rest }) => ({
      ...rest,
      items,
      title,
      column,
      bordered,
      size,
      style: {
        width: "100%",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Steps: {
    mapProps: ({ current, direction, size, items, status, onChange, styles, ...rest }) => ({
      ...rest,
      current,
      orientation: direction,
      size,
      items: Array.isArray(items)
        ? items.map((item) => {
            if (typeof item !== "object" || item === null) {
              return item;
            }

            const { description: _description, ...stepItem } = item as Record<
              string,
              unknown
            >;

            return {
              ...stepItem,
              content:
                typeof stepItem.content === "string" && stepItem.content.trim()
                  ? stepItem.content
                  : typeof _description === "string" && _description.trim()
                    ? _description
                    : undefined,
            };
          })
        : items,
      status,
      onChange,
      style: styles,
    }),
  },
  Dropdown: {
    mapProps: ({
      menu,
      trigger,
      placement,
      disabled,
      open,
      onOpenChange,
      autoAdjustOverflow,
      styles,
      ...rest
    }) => ({
      ...rest,
      menu,
      trigger: Array.isArray(trigger)
        ? trigger
        : trigger === "contextMenu"
          ? ["contextMenu"]
          : trigger === "click"
            ? ["click"]
            : ["hover"],
      placement,
      disabled,
      open,
      onOpenChange,
      autoAdjustOverflow,
      overlayStyle: styles,
    }),
  },
  Tooltip: {
    mapProps: ({
      title,
      placement,
      color,
      trigger,
      open,
      onOpenChange,
      styles,
      ...rest
    }) => ({
      ...rest,
      title,
      placement,
      color,
      trigger,
      open,
      onOpenChange,
      overlayStyle: styles,
    }),
  },
  Tabs: {
    mapProps: ({
      items,
      activeKey,
      type,
      tabPlacement,
      tabPosition,
      centered,
      onChange,
      onTabClick,
      styles,
      ...rest
    }) => ({
      ...rest,
      items,
      activeKey,
      type,
      tabPlacement:
        tabPlacement ??
        (tabPosition === "right" ||
        tabPosition === "bottom" ||
        tabPosition === "left"
          ? tabPosition
          : "top"),
      centered,
      onChange,
      onTabClick,
      style: styles,
    }),
  },
  Menu: {
    mapProps: ({
      items,
      mode,
      selectedKeys,
      theme,
      inlineCollapsed,
      onClick,
      onSelect,
      onOpenChange,
      styles,
      ...rest
    }) => ({
      ...rest,
      items,
      mode,
      selectedKeys,
      theme,
      inlineCollapsed,
      onClick,
      onSelect,
      onOpenChange,
      style: {
        width: mode === "horizontal" ? "100%" : inlineCollapsed ? 80 : 220,
        minWidth: mode === "horizontal" ? 0 : inlineCollapsed ? 80 : 220,
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Progress: {
    mapProps: ({
      percent,
      status,
      type,
      strokeColor,
      showInfo,
      styles,
      ...rest
    }) => ({
      ...rest,
      percent,
      status,
      type,
      strokeColor,
      showInfo,
      style: {
        width: type === "circle" || type === "dashboard" ? undefined : "100%",
        minWidth: type === "circle" || type === "dashboard" ? undefined : 160,
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Upload: {
    mapProps: ({
      action,
      listType,
      maxCount,
      accept,
      multiple,
      fileList,
      onChange,
      onPreview,
      onRemove,
      openFileDialogOnClick,
      styles,
      ...rest
    }) => ({
      ...rest,
      action,
      listType,
      maxCount,
      accept,
      multiple,
      fileList,
      onChange,
      onPreview,
      onRemove,
      openFileDialogOnClick,
      style: {
        width: "100%",
        minWidth: 180,
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
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
  List: {
    mapProps: ({
      dataSource,
      itemLayout,
      bordered,
      size,
      header,
      footer,
      renderItem,
      styles,
      ...rest
    }) => ({
      ...rest,
      dataSource,
      itemLayout,
      bordered,
      size,
      header,
      footer,
      renderItem,
      style: {
        width: "100%",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Popover: {
    mapProps: ({
      title,
      content,
      placement,
      trigger,
      open,
      color,
      onOpenChange,
      styles,
      ...rest
    }) => ({
      ...rest,
      title,
      content,
      placement,
      trigger,
      open,
      color,
      onOpenChange,
      overlayStyle: styles,
    }),
  },
  Spin: {
    mapProps: ({ spinning, tip, size, fullscreen, styles, ...rest }) => ({
      ...rest,
      spinning,
      tip,
      size,
      fullscreen,
      style: styles,
    }),
  },
  Table: {
    mapProps: ({
      columns,
      dataSource,
      bordered,
      size,
      pagination,
      rowKey,
      onChange,
      onRow,
      scroll,
      tableLayout,
      styles,
      ...rest
    }) => ({
      ...rest,
      columns,
      dataSource,
      bordered,
      size,
      pagination,
      rowKey,
      onChange,
      onRow,
      scroll,
      tableLayout,
      style: {
        width: "100%",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
    }),
  },
  Tree: {
    mapProps: ({
      treeData,
      defaultExpandAll,
      selectable,
      checkable,
      onSelect,
      onCheck,
      onExpand,
      styles,
      ...rest
    }) => ({
      ...rest,
      treeData,
      defaultExpandAll,
      selectable,
      checkable,
      onSelect,
      onCheck,
      onExpand,
      style: {
        width: "100%",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      },
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
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CheckboxGroup,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  List,
  Popover,
  Spin,
  Tree,
  Table,
  Menu,
  TextArea,
  RadioGroup,
  Select,
  Steps,
  Dropdown,
  Tooltip,
  Tabs,
  Upload,
  Switch,
  Modal,
  Progress,
  Row,
  Space,
  Tag,
  materials: antdMaterialBindings,
};
