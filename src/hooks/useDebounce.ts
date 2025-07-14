/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 防抖值Hook - 延迟更新值
 * @param value 需要防抖的值
 * @param delay 延迟时间，默认300ms
 * @returns 防抖后的值
 */
export function useDebounceValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置一个定时器，在指定的延迟后更新debouncedValue
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 在下一次effect运行前清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖函数Hook - 创建一个防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间，默认300ms
 * @param deps 依赖项数组，类似于useCallback的依赖项
 * @returns 防抖后的函数和取消函数
 */
export function useDebounceFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
  deps: React.DependencyList = []
): [(...args: Parameters<T>) => void, () => void] {
  const timerRef = useRef<number | null>(null);
  
  // 清除定时器的函数
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // 在组件卸载时清除定时器
  useEffect(() => {
    return cancel;
  }, [cancel]);
  
  // 创建防抖函数
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      
      timerRef.current = window.setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay, cancel, ...deps]
  );
  
  return [debouncedFn, cancel];
}

/**
 * 带立即执行选项的防抖函数Hook
 * @param fn 需要防抖的函数
 * @param delay 延迟时间，默认300ms
 * @param deps 依赖项数组
 * @returns [防抖函数, 立即执行函数, 取消函数]
 */
export function useDebounceWithImmediate<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
  deps: React.DependencyList = []
): [
  (...args: Parameters<T>) => void,  // 防抖函数
  (...args: Parameters<T>) => void,  // 立即执行函数
  () => void                         // 取消函数
] {
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<boolean>(false);
  
  // 清除定时器的函数
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingRef.current = false;
  }, []);
  
  // 在组件卸载时清除定时器
  useEffect(() => {
    return cancel;
  }, [cancel]);
  
  // 创建防抖函数
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      
      pendingRef.current = true;
      
      timerRef.current = window.setTimeout(() => {
        if (pendingRef.current) {
          fn(...args);
          pendingRef.current = false;
        }
      }, delay);
    },
    [fn, delay, cancel, ...deps]
  );
  
  // 立即执行函数
  const immediateFn = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      fn(...args);
    },
    [fn, cancel, ...deps]
  );
  
  return [debouncedFn, immediateFn, cancel];
}

export default useDebounceWithImmediate; 