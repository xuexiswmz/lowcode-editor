import React from 'react';
import { validateRules } from "../components/Setting/actions/Validate";
import type { Component } from "../stores/components";
import { type ActionConfig, type SetState } from "./types";

// 定义校验函数类型
export type ValidateFunction = (value: string | number | boolean | undefined | null) => boolean;

// 保存每个组件的错误信息
export interface ErrorState {
  [componentId: string]: string | null;
}

// 组件样式类型
export type ComponentStyles = Record<string, string | number | boolean | undefined | null>;

/**
 * 执行校验规则
 * @param component 组件
 * @param value 要校验的值
 * @param action 校验动作配置
 * @param setErrors 设置错误状态的函数
 * @returns 校验是否通过
 */
export function validateField(
  component: Component, 
  value: string | number, 
  action: ActionConfig,
  setErrors: SetState<ErrorState>
): boolean {
  if (action.type === "validate" && action.config) {
    const { rule, message: errorMessage, custom } = action.config;
    
    let isValid = true;
    const stringValue = String(value);
    
    if (rule === "custom" && custom) {
      // 自定义正则校验需要传入value和custom两个参数
      isValid = validateRules.custom(stringValue, custom);
    } else if (rule in validateRules && rule !== "custom") {
      // 其他内置校验规则只需要传入value一个参数
      const validateFn = validateRules[rule as keyof typeof validateRules] as ValidateFunction;
      isValid = validateFn(value);
    }
    
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        [component.id]: errorMessage
      }));
      return false;
    }
  }
  return true;
}

/**
 * 清除组件的错误状态
 * @param componentId 组件ID
 * @param errors 当前错误状态
 * @param setErrors 设置错误状态的函数
 */
export function clearComponentError(
  componentId: string,
  errors: ErrorState,
  setErrors: SetState<ErrorState>
): void {
  if (errors[componentId]) {
    setErrors(prev => ({
      ...prev,
      [componentId]: null
    }));
  }
}

/**
 * 获取带有错误样式的组件样式
 * @param componentId 组件ID
 * @param originalStyles 原始样式
 * @param errors 错误状态
 * @returns 添加了错误样式的组件样式
 */
export function getErrorStyle(
  componentId: string,
  originalStyles: ComponentStyles | undefined,
  errors: ErrorState
): ComponentStyles {
  return errors[componentId] 
    ? {
        borderColor: '#ff4d4f',
        ...(originalStyles || {})
      } 
    : (originalStyles || {});
}

/**
 * 渲染错误信息
 * @param componentId 组件ID
 * @param errors 错误状态
 * @returns 错误信息元素或null
 */
export function renderErrorMessage(componentId: string, errors: ErrorState): React.ReactNode {
  if (!errors[componentId]) return null;
  
  return React.createElement(
    'div',
    {
      style: { 
        color: '#ff4d4f', 
        fontSize: '12px', 
        lineHeight: '1.5', 
        marginTop: '4px',
        paddingLeft: '4px'
      }
    },
    errors[componentId]
  );
} 