import { useEffect, useState } from "react";
import { Modal, Segmented } from "antd";
import GoToLink, { type GoToLinkConfig } from "./actions/GoToLink";
import ShowMessage, { type ShowMessageConfig } from "./actions/ShowMessage";
import type { CustomJSConfig } from "./actions/CustomJS";
import CustomJS from "./actions/CustomJS";
import ComponentMethod, {
  type ComponentMethodConfig,
} from "./actions/ComponentMethod";

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
  | ComponentMethodConfig;

export default function ActionModal(props: ActionModalProps) {
  const { visible, action, handleOk, handleCancel } = props;
  const map = {
    goToLink: "访问链接",
    showMessage: "消息提示",
    customJS: "自定义JS",
    componentMethod: "组件方法",
  };
  const [key, setKey] = useState<string>("访问链接");
  const [curConfig, setCurConfig] = useState<ActionConfig>();

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
          options={["访问链接", "消息提示", "组件方法", "自定义JS"]}
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
            key="showMessage"
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
      </div>
    </Modal>
  );
}
