import React from 'react';
import { message } from 'antd';
import type { Component } from '../stores/components';
import type { ComponentEvent } from '../stores/component-config';
import { validateField, clearComponentError, type ErrorState } from './validation';
import { executeCustomJS, executeFetch } from './customJS';
import { type ComponentRef, type SetState } from './types';

/**
 * 从事件对象或直接值中提取值
 * @param e 事件对象或值
 * @param defaultValue 默认值
 * @returns 提取的值
 */
export function extractValueFromEvent(
  e: React.SyntheticEvent | string | number,
  defaultValue: string | number = ''
): string | number {
  if (e && typeof e === 'object' && 'target' in e && e.target && 'value' in e.target) {
    // 处理事件对象
    return (e.target as HTMLInputElement).value;
  } else if (typeof e === 'string' || typeof e === 'number') {
    // 直接传入值
    return e;
  }
  // 使用默认值
  return defaultValue;
}

/**
 * 处理组件事件
 * @param component 组件
 * @param event 事件配置
 * @param errors 错误状态
 * @param setErrors 设置错误状态的函数
 * @param componentRef 组件引用
 * @returns 事件处理函数
 */
export function createEventHandler(
  component: Component,
  event: ComponentEvent,
  errors: ErrorState,
  setErrors: SetState<ErrorState>,
  componentRef: React.MutableRefObject<ComponentRef>
) {
  const eventConfig = component.props[event.name];
  if (!eventConfig) return undefined;

  return (e: React.SyntheticEvent | string | number) => {
    // 获取当前值，用于校验
    const value = extractValueFromEvent(e, component.props.value as string || '');
    
    // 清除之前的错误信息
    clearComponentError(String(component.id), errors, setErrors);
    
    // 执行所有动作
    let allValid = true;
    
    for (const action of eventConfig?.actions || []) {
      // 如果是校验动作，先执行校验
      if (action.type === "validate") {
        const isValid = validateField(component, value, action, setErrors);
        if (!isValid) {
          allValid = false;
          break; // 一旦有校验失败，停止执行后续动作
        }
      } else if (action.type === "goToLink" && action.url) {
        window.location.href = action.url;
      } else if (action.type === "showMessage" && action.config) {
        if (action.config.type === "success") {
          message.success(action.config.text);
        } else if (action.config.type === "error") {
          message.error(action.config.text);
        }
      } else if (action.type === "customJS") {
        executeCustomJS(component, action.code, value, componentRef.current);
      } else if (action.type === "componentMethod") {
        const targetComponent = componentRef.current[action.config.componentId];
        if (targetComponent) {
          if (typeof targetComponent[action.config.method] === "function") {
            (
              targetComponent[action.config.method] as (
                ...args: unknown[]
              ) => unknown
            )();
          }
        }
      } else if (action.type === "fetch" && action.config) {
        executeFetch(component, action.config, value, componentRef.current);
      }
    }
    
    // 如果所有校验都通过，可以执行其他操作
    return allValid;
  };
}

/**
 * 为组件创建所有事件处理函数
 * @param component 组件
 * @param events 事件配置列表
 * @param errors 错误状态
 * @param setErrors 设置错误状态的函数
 * @param componentRef 组件引用
 * @returns 事件处理函数映射
 */
export function createEventHandlers(
  component: Component,
  events: ComponentEvent[] = [],
  errors: ErrorState,
  setErrors: SetState<ErrorState>,
  componentRef: React.MutableRefObject<ComponentRef>
): Record<string, unknown> {
  const handlers: Record<string, unknown> = {};
  
  events.forEach(event => {
    const handler = createEventHandler(component, event, errors, setErrors, componentRef);
    if (handler) {
      handlers[event.name] = handler;
    }
  });
  
  return handlers;
} 