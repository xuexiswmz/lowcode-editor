import { useEffect, useState } from "react";
import { Modal, Segmented } from "antd";
import GoToLink, { type GoToLinkConfig } from "./actions/GoToLink";
import ShowMessage, { type ShowMessageConfig } from "./actions/ShowMessage";
import type { CustomJSConfig } from "./actions/CustomJS";
import CustomJS from "./actions/CustomJS";
import ComponentMethod, {
  type ComponentMethodConfig,
} from "./actions/ComponentMethod";
import Fetch, { type FetchConfig } from "./actions/Fetch";
import Validate, { type ValidateConfig } from "./actions/Validate";

export interface ActionModalProps {
  visible: boolean;
  action?: ActionConfig;
  handleOk: (config?: ActionConfig) => void;
  handleCancel: () => void;
}
export type ActionConfig =
  | GoToLinkConfig
  | ShowMessageConfig
  | CustomJSConfig
  | ComponentMethodConfig
  | FetchConfig
  | ValidateConfig;

export default function ActionModal(props: ActionModalProps) {
  const { visible, action, handleOk, handleCancel } = props;
  const map = {
    goToLink: "访问链接",
    showMessage: "消息提示",
    customJS: "自定义JS",
    componentMethod: "组件方法",
    fetch: "数据请求",
    validate: "表单校验",
  };
  const [key, setKey] = useState<string>("访问链接");
  const [curConfig, setCurConfig] = useState<ActionConfig>();

  // 初始化时设置curConfig
  useEffect(() => {
    if (action) {
      setCurConfig(action);
    } else {
      // 根据当前选中的tab设置默认配置
      initConfigByKey(key);
    }
  }, [action, visible]);

  // 切换tab时重置curConfig
  useEffect(() => {
    if (visible) {
      initConfigByKey(key);
    }
  }, [key, visible]);

  // 根据key初始化对应的配置
  function initConfigByKey(currentKey: string) {
    switch (currentKey) {
      case "访问链接":
        setCurConfig({ type: "goToLink", url: "" });
        break;
      case "消息提示":
        setCurConfig({
          type: "showMessage",
          config: { type: "success", text: "" },
        });
        break;
      case "组件方法":
        setCurConfig({
          type: "componentMethod",
          config: { componentId: 0, method: "" },
        });
        break;
      case "自定义JS":
        setCurConfig({ type: "customJS", code: "" });
        break;
      case "数据请求":
        setCurConfig({ type: "fetch", config: { api: "", params: {} } });
        break;
      case "表单校验":
        setCurConfig({
          type: "validate",
          config: { rule: "required", message: "" },
        });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (action?.type) {
      setKey(map[action.type]);
    }
  }, [action]);

  return (
    <Modal
      title="事件配置"
      width={800}
      open={visible}
      okText="添加"
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
    >
      <div className="h-[500px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={[
            "访问链接",
            "消息提示",
            "组件方法",
            "自定义JS",
            "数据请求",
            "表单校验",
          ]}
        />
        {key === "访问链接" && (
          <GoToLink
            key="goToLink"
            value={action?.type === "goToLink" ? action.url : ""}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "消息提示" && (
          <ShowMessage
            key="showMessage"
            value={action?.type === "showMessage" ? action.config : undefined}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "组件方法" && (
          <ComponentMethod
            key="componentMethod"
            value={
              action?.type === "componentMethod" ? action.config : undefined
            }
            onChange={(config) => setCurConfig(config)}
          />
        )}
        {key === "自定义JS" && (
          <CustomJS
            key="customJS"
            value={action?.type === "customJS" ? action.code : ""}
            onChange={(config) => setCurConfig(config)}
          />
        )}
        {key === "数据请求" && (
          <Fetch
            key="fetch"
            value={action?.type === "fetch" ? action.config : undefined}
            onChange={(config) => setCurConfig(config)}
          />
        )}
        {key === "表单校验" && (
          <Validate
            key="validate"
            value={action?.type === "validate" ? action.config : undefined}
            onChange={(config) => setCurConfig(config)}
          />
        )}
      </div>
    </Modal>
  );
}
