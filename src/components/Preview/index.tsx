import React, { useRef, useState } from "react";
import { useComponentsStore, type Component } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";
import {
  type ErrorState,
  type ComponentStyles,
  getErrorStyle,
  renderErrorMessage,
} from "../../utils/validation";
import { createEventHandlers } from "../../utils/eventHandler";
import { type ComponentRef } from "../../utils/types";

// 定义不能接受children的组件列表
const VOID_COMPONENTS = ["Input"];

/**
 * 预览组件
 * 负责渲染组件树并处理组件事件
 */
export default function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const componentRef = useRef<ComponentRef>({});
  const [errors, setErrors] = useState<ErrorState>({});

  /**
   * 渲染组件树
   * @param components 组件列表
   * @returns React节点
   */
  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.prod) {
        return null;
      }

      // 检查是否是不能接受children的组件
      const isVoidComponent = VOID_COMPONENTS.includes(component.name);

      // 为组件添加错误提示样式
      const errorStyle = getErrorStyle(
        String(component.id),
        component.styles as ComponentStyles,
        errors
      );

      // 创建事件处理函数
      const eventHandlers = createEventHandlers(
        component,
        componentConfig[component.name].events,
        errors,
        setErrors,
        componentRef
      );

      // 创建组件元素
      const componentElement = isVoidComponent
        ? React.createElement(config.prod, {
            key: component.id,
            id: component.id,
            name: component.name,
            styles: errorStyle,
            ref: (ref: Record<string, unknown>) => {
              if (ref) componentRef.current[component.id] = ref;
            },
            ...config.defaultProps,
            ...component.props,
            ...eventHandlers,
          })
        : React.createElement(
            config.prod,
            {
              key: component.id,
              id: component.id,
              name: component.name,
              styles: errorStyle,
              ref: (ref: Record<string, unknown>) => {
                if (ref) componentRef.current[component.id] = ref;
              },
              ...config.defaultProps,
              ...component.props,
              ...eventHandlers,
            },
            renderComponents(component.children || [])
          );

      // 如果有错误信息，添加错误提示
      return (
        <React.Fragment key={component.id}>
          {componentElement}
          {renderErrorMessage(String(component.id), errors)}
        </React.Fragment>
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
