import { useComponentsStore } from "../../stores/components";
import {
  useComponentConfigStore,
  type ComponentEvent,
} from "../../stores/component-config";
import { Button, Collapse, type CollapseProps } from "antd";
import { useState } from "react";
import ActionModal, { type ActionConfig } from "./ActionModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function ComponentEvent() {
  const { curComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();
  const [curAction, setCurAction] = useState<ActionConfig>();
  const [curActionIndex, setCurActionIndex] = useState<number>();

  if (!curComponent) return null;

  function deleteAction(event: ComponentEvent, index: number) {
    if (!curComponent) {
      return;
    }
    const actions = curComponent.props[event.name]?.actions;
    actions.splice(index, 1);
    updateComponentProps(curComponent.id, {
      [event.name]: {
        actions: actions,
      },
    });
  }
  function editAction(config: ActionConfig, index: number) {
    if (!curComponent) {
      return;
    }
    setCurAction(config);
    setCurActionIndex(index);
    setActionModalOpen(true);
  }

  const items: CollapseProps["items"] = (
    componentConfig[curComponent.name].events || []
  ).map((event) => {
    return {
      key: event.name,
      label: (
        <div className="flex justify-between leading-[30px]">
          {event.label}
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              setCurEvent(event);
              setActionModalOpen(true);
            }}
          >
            添加动作
          </Button>
        </div>
      ),
      children: (
        <div>
          {(curComponent.props[event.name]?.actions || []).map(
            (item: ActionConfig, index: number) => {
              return (
                <div key={item.type + "_" + index}>
                  {item.type === "goToLink" ? (
                    <div
                      key="goToLink"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[#f9367d]">跳转链接</div>
                      <div>{item.url}</div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 30,
                          cursor: "pointer",
                        }}
                        onClick={() => editAction(item, index)}
                      >
                        <EditOutlined />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          cursor: "pointer",
                        }}
                        onClick={() => deleteAction(event, index)}
                      >
                        <DeleteOutlined />
                      </div>
                    </div>
                  ) : null}
                  {item.type === "showMessage" ? (
                    <div
                      key="showMessage"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[#36b8eb]">消息弹窗</div>
                      <div>{item.config.type}</div>
                      <div>{item.config.text}</div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 30,
                          cursor: "pointer",
                        }}
                        onClick={() => editAction(item, index)}
                      >
                        <EditOutlined />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          cursor: "pointer",
                        }}
                        onClick={() => deleteAction(event, index)}
                      >
                        <DeleteOutlined />
                      </div>
                    </div>
                  ) : null}
                  {item.type === "customJS" ? (
                    <div
                      key="customJS"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[#b3a400]">自定义JS</div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 30,
                          cursor: "pointer",
                        }}
                        onClick={() => editAction(item, index)}
                      >
                        <EditOutlined />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          cursor: "pointer",
                        }}
                        onChange={() => deleteAction(event, index)}
                      >
                        <DeleteOutlined />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }
          )}
        </div>
      ),
    };
  });
  function handleModalOk(config?: ActionConfig) {
    if (!config || !curEvent || !curComponent) {
      return;
    }
    if (curAction) {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: curComponent.props[curEvent.name]?.actions.map(
            (item: ActionConfig, index: number) => {
              return index === curActionIndex ? config : item;
            }
          ),
        },
      });
    } else {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: [
            ...(curComponent.props[curEvent.name]?.actions || []),
            config,
          ],
        },
      });
    }
    setCurAction(undefined);
    setActionModalOpen(false);
  }
  return (
    <div className="px-[10px]">
      <Collapse
        className="mb-[100px]"
        items={items}
        defaultActiveKey={componentConfig[curComponent.name].events?.map(
          (item) => item.name
        )}
      />
      <ActionModal
        visible={actionModalOpen}
        handleOk={handleModalOk}
        action={curAction}
        handleCancel={() => setActionModalOpen(false)}
      />
    </div>
  );
}
