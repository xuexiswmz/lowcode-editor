import { message } from "antd";
import type { Component } from "../stores/components";
import { type ComponentRef } from "./types";

/**
 * 执行自定义JS代码
 * @param component 组件
 * @param code JS代码
 * @param eventValue 事件值
 * @param componentRef 组件引用
 * @returns 执行结果
 */
export function executeCustomJS(
  component: Component, 
  code: string, 
  eventValue?: string | number,
  componentRef?: ComponentRef
): unknown {
  try {
    const func = new Function("context", code);
    return func({
      name: component.name,
      props: component.props,
      value: eventValue, // 传递事件值给自定义JS
      showMessage(content: string, type: 'success' | 'error' = 'success') {
        if (type === 'success') {
          message.success(content);
        } else {
          message.error(content);
        }
      },
      fetch: window.fetch.bind(window), // 绑定fetch到window对象
      componentRef: componentRef, // 提供组件引用，可以调用其他组件的方法
    });
  } catch (error) {
    console.error("执行自定义JS错误:", error);
    message.error(`执行自定义JS错误: ${(error as Error).message}`);
    return null;
  }
}

/**
 * 生成fetch请求的JS代码
 * @param api API地址
 * @param method 请求方法
 * @param params 请求参数
 * @param value 当前值
 * @returns 生成的JS代码
 */
export function generateFetchCode(
  api: string, 
  method: string = 'GET', 
  params: Record<string, string> = {},
  value?: string | number
): string {
  // 替换参数中的${value}为实际值
  const processedParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, paramValue]) => {
    if (typeof paramValue === 'string') {
      processedParams[key] = paramValue.replace('${value}', String(value || ''));
    } else {
      processedParams[key] = String(paramValue);
    }
  });
  
  // 构建fetch代码
  return `
    (async function() {
      try {
        const options = {
          method: '${method}',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        ${method !== 'GET' ? `
          options.body = JSON.stringify(${JSON.stringify(processedParams)});
        ` : ''}
        
        const url = '${api}' ${method === 'GET' && Object.keys(processedParams).length > 0 ? 
          `+ '?' + new URLSearchParams(${JSON.stringify(processedParams)}).toString()` : 
          ''};
        
        const response = await context.fetch(url, options);
        
        if (!response.ok) {
          throw new Error('请求失败: ' + response.status);
        }
        
        const responseData = await response.json();
        console.log('请求成功:', responseData);
        
        // 检查响应格式，处理标准API响应格式
        if (responseData && typeof responseData === 'object') {
          if (responseData.code !== undefined) {
            // 有标准的code字段
            if (responseData.code !== 200 && responseData.message) {
              // 如果code不是200，显示错误消息
              context.showMessage(responseData.message || '请求失败', 'error');
              return responseData;
            }
            // 如果有data字段，直接返回data内容
            if (responseData.data !== undefined) {
              return responseData.data;
            }
          }
        }
        
        // 如果不是标准格式或没有data字段，返回整个响应
        return responseData;
      } catch (error) {
        console.error('请求错误:', error);
        context.showMessage('请求错误: ' + error.message, 'error');
      }
    })();
  `;
}

/**
 * 执行fetch请求
 * @param component 组件
 * @param fetchConfig fetch配置
 * @param value 当前值
 * @param componentRef 组件引用
 * @returns 执行结果
 */
export function executeFetch(
  component: Component,
  fetchConfig: {
    api: string;
    method?: string;
    params?: Record<string, string>;
  },
  value?: string | number,
  componentRef?: ComponentRef
): unknown {
  const { api, method = 'GET', params = {} } = fetchConfig;
  const fetchCode = generateFetchCode(api, method, params, value);
  return executeCustomJS(component, fetchCode, value, componentRef);
} 