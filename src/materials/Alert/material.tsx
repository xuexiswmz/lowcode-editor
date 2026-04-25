import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { ALERT_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Alert, materials } from "../ui";

type AlertType = "success" | "info" | "warning" | "error";

type AlertProps = Omit<CommonComponentProps, "children"> & {
  message?: string;
  description?: string;
  type?: AlertType;
  closable?: boolean;
  showIcon?: boolean;
  banner?: boolean;
};

function normalizeAlertType(type: unknown): AlertType {
  return type === "success" || type === "warning" || type === "error"
    ? type
    : "info";
}

const AlertRenderer = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      id,
      message = "提示信息",
      description = "",
      type = "info",
      closable = false,
      showIcon = true,
      banner = false,
      styles,
      onClose,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} data-component-id={id}>
      <Alert
        {...materials.Alert.mapProps(
          {
            message,
            description: description || undefined,
            type: normalizeAlertType(type),
            closable,
            showIcon,
            banner,
            onClose,
            styles,
            ...props,
          },
          { mode: "preview" },
        )}
      />
    </div>
  ),
);

const AlertEditorRenderer = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      id,
      message = "提示信息",
      description = "",
      type = "info",
      closable = false,
      showIcon = true,
      banner = false,
      styles,
      onClose,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} data-component-id={id}>
      <Alert
        {...materials.Alert.mapProps(
          {
            message,
            description: description || undefined,
            type: normalizeAlertType(type),
            closable,
            showIcon,
            banner,
            onClose,
            styles,
            ...props,
          },
          { mode: "editor" },
        )}
      />
    </div>
  ),
);

AlertRenderer.displayName = "AlertRenderer";
AlertEditorRenderer.displayName = "AlertEditorRenderer";

export default createLeafMaterial({
  name: "Alert",
  category: "feedback",
  desc: "警告提示",
  defaultProps: {
    message: "提示信息",
    description: "这是一条警告提示描述",
    type: "info",
    closable: false,
    showIcon: true,
    banner: false,
  },
  allowedParents: [...ALERT_ALLOWED_PARENTS],
  setter: [
    field.input("message", "标题"),
    field.textarea("description", "描述"),
    field.select("type", "类型", [
      { label: "成功", value: "success" },
      { label: "信息", value: "info" },
      { label: "警告", value: "warning" },
      { label: "错误", value: "error" },
    ]),
    field.switch("closable", "可关闭"),
    field.switch("showIcon", "显示图标"),
    field.switch("banner", "横幅模式"),
  ],
  events: [{ name: "onClose", label: "关闭事件" }],
  render: AlertRenderer,
  renderInEditor: AlertEditorRenderer,
});
