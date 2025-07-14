import type { ActionConfig as OriginalActionConfig } from "../components/Setting/ActionModal";

// 重新导出ActionConfig类型
export type ActionConfig = OriginalActionConfig;

// 组件引用类型
export type ComponentRef = Record<string, Record<string, unknown>>;

// 设置状态函数类型
export type SetState<T> = (updater: (prev: T) => T) => void; 