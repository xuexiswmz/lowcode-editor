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

// 定义不需要在预览中渲染的组件列表
const HIDDEN_COMPONENTS = ["FormItem"];

// 定义需要特殊处理子组件的组件列表
const SPECIAL_PARENT_COMPONENTS = ["Form"];

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
   * 处理FormItem组件，转换为配置对象
   * @param formItem FormItem组件
   * @returns FormItem配置对象
   */
  function processFormItem(formItem: Component) {
    // 调试日志
    console.log("处理FormItem:", formItem);

    return {
      label: formItem.props?.label,
      name: formItem.props?.name,
      type: formItem.props?.type,
      id: formItem.id,
    };
  }

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
        componentConfig[component.name].events || [],
        errors,
        setErrors,
        componentRef
      );

      // 处理特殊组件的子组件
      let specialProps = {};
      if (
        SPECIAL_PARENT_COMPONENTS.includes(component.name) &&
        component.children?.length
      ) {
        // 如果是Form组件，处理FormItem子组件
        if (component.name === "Form") {
          // 调试日志
          console.log(
            `处理Form组件(${component.id})的子组件:`,
            component.children
          );

          const formItems = component.children
            .filter((child) => child.name === "FormItem")
            .map(processFormItem);

          if (formItems.length > 0) {
            specialProps = { formItems };
            // 调试日志
            console.log(`Form组件(${component.id})的formItems:`, formItems);
          } else {
            console.warn(`Form组件(${component.id})没有FormItem子组件`);
          }
        }
      }

      // 过滤掉不需要渲染的子组件
      const filteredChildren = (component.children || []).filter(
        (child) => !HIDDEN_COMPONENTS.includes(child.name)
      );

      // 调试日志
      console.log(`Rendering component ${component.name}(${component.id}):`, {
        props: component.props,
        specialProps,
        children: component.children,
        filteredChildren,
      });

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
            ...specialProps,
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
              ...specialProps,
            },
            renderComponents(filteredChildren)
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
