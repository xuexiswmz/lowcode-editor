import { getComponentById, useComponentsStore } from "../../stores/components";
import {
  useComponentConfigStore,
  type ComponentEvent,
} from "../../stores/component-config";
import { Button, Collapse, type CollapseProps } from "antd";
import { useState } from "react";
import ActionModal, { type ActionConfig } from "./ActionModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDebounceWithImmediate } from "../../hooks/useDebounce";

export default function ComponentEvent() {
  const { curComponent, updateComponentProps, components } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();
  const [curAction, setCurAction] = useState<ActionConfig>();
  const [curActionIndex, setCurActionIndex] = useState<number>();

  // 使用useDebounceWithImmediate替代原来的防抖实现
  const [debouncedUpdate, immediateUpdate] = useDebounceWithImmediate(
    (componentId: number, props: Record<string, unknown>) => {
      console.log("防抖后更新组件属性:", { componentId, props });
      updateComponentProps(componentId, props);
    },
    300,
    [updateComponentProps]
  );

  if (!curComponent) return null;

  // 通用的更新组件属性函数，根据immediate参数决定是否使用防抖
  function updateProps(
    componentId: number,
    props: Record<string, unknown>,
    immediate = false
  ) {
    if (immediate) {
      immediateUpdate(componentId, props);
    } else {
      debouncedUpdate(componentId, props);
    }
  }

  function deleteAction(event: ComponentEvent, index: number) {
    if (!curComponent) {
      return;
    }
    const actions = [...(curComponent.props[event.name]?.actions || [])];
    actions.splice(index, 1);

    // 删除操作应该立即执行，不需要防抖
    updateProps(
      curComponent.id,
      {
        [event.name]: {
          actions: actions,
        },
      },
      true
    );
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
              setCurAction(undefined);
              setCurActionIndex(undefined);
              setActionModalOpen(true);
              console.log("点击添加动作按钮:", { event });
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
                  {item.type === "componentMethod" ? (
                    <div
                      key="componentMethod"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[#23e06c]">组件方法</div>
                      <div>
                        {
                          getComponentById(item.config.componentId, components)
                            ?.desc
                        }
                      </div>
                      <div>{item.config.componentId}</div>
                      <div>{item.config.method}</div>
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
                  {item.type === "fetch" ? (
                    <div
                      key="fetch"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[#1890ff]">数据请求</div>
                      <div>API: {item.config.api}</div>
                      <div>方法: {item.config.method || "GET"}</div>
                      {item.config.debounce && (
                        <div>防抖: {item.config.debounce}ms</div>
                      )}
                      {Object.keys(item.config.params).length > 0 && (
                        <div>
                          参数:
                          {Object.entries(item.config.params).map(
                            ([key, value]) => (
                              <span key={key} className="ml-[5px]">
                                {key}={value}
                              </span>
                            )
                          )}
                        </div>
                      )}
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
                  {item.type === "validate" ? (
                    <div
                      key="validate"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[#722ed1]">表单校验</div>
                      <div>规则: {item.config.rule}</div>
                      <div>提示: {item.config.message}</div>
                      {item.config.custom && (
                        <div>自定义正则: {item.config.custom}</div>
                      )}
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
      console.log("缺少必要参数:", { config, curEvent, curComponent });
      return;
    }

    console.log("添加/编辑动作:", {
      config,
      curEvent,
      curAction,
      curActionIndex,
      componentProps: curComponent.props[curEvent.name],
    });

    if (curAction) {
      // 编辑现有动作
      updateProps(
        curComponent.id,
        {
          [curEvent.name]: {
            actions: curComponent.props[curEvent.name]?.actions.map(
              (item: ActionConfig, index: number) => {
                return index === curActionIndex ? config : item;
              }
            ),
          },
        },
        true // 使用立即执行，因为这是用户明确的操作
      );
    } else {
      // 添加新动作
      const currentActions = curComponent.props[curEvent.name]?.actions || [];
      updateProps(
        curComponent.id,
        {
          [curEvent.name]: {
            actions: [...currentActions, config],
          },
        },
        true // 使用立即执行，因为这是用户明确的操作
      );
    }

    // 重置状态并关闭弹窗
    setCurAction(undefined);
    setCurActionIndex(undefined);
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
