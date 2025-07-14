# LowCode Editor (LCE)

一个基于 React 的低代码编辑器，允许用户通过拖拽组件快速构建应用界面。

## 项目核心功能

- **组件拖拽**: 支持从物料库拖拽组件到编辑区域
- **组件配置**: 可视化配置组件属性、样式和事件
- **组件嵌套**: 支持组件嵌套，构建复杂布局
- **实时预览**: 编辑过程中可随时切换到预览模式查看效果
- **事件绑定**: 支持为组件绑定各种交互事件
- **自定义代码**: 支持编写自定义 JavaScript 代码
- **数据请求**: 内置 Fetch 功能，支持 API 调用
- **表单验证**: 支持表单组件的数据验证

## 项目架构

### 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design
- **状态管理**: Zustand
- **拖拽功能**: React DnD
- **代码编辑器**: Monaco Editor
- **布局组件**: Allotment (分割面板)
- **样式**: TailwindCSS

### 核心模块

1. **编辑器主体** (`src/editor/index.tsx`)

   - 分为三个主要区域：物料面板、编辑区域、配置面板
   - 支持预览模式切换

2. **物料系统** (`src/components/Material`)

   - 提供可拖拽的 UI 组件
   - 支持自定义组件扩展

3. **编辑区域** (`src/components/EditArea.tsx`)

   - 组件拖放目标区域
   - 支持组件选择、移动和嵌套

4. **配置面板** (`src/components/Setting`)

   - 组件属性编辑
   - 样式配置
   - 事件绑定
   - 动作配置（Fetch、验证等）

5. **状态管理** (`src/stores`)

   - 组件状态 (`components.tsx`)
   - 组件配置 (`component-config.tsx`)

6. **工具函数** (`src/utils`)
   - 事件处理
   - 表单验证
   - 自定义 JS 执行

## 自定义 Hooks

### useDebounce

防抖 Hook，提供三种不同的防抖功能：

#### 1. useDebounceValue - 防抖值

用于对频繁变化的值进行防抖处理，如搜索框输入。

```tsx
import { useDebounceValue } from "./hooks/useDebounce";

// 使用示例
const [searchTerm, setSearchTerm] = useState("");
// 500ms后更新debouncedSearchTerm
const debouncedSearchTerm = useDebounceValue(searchTerm, 500);
```

#### 2. useDebounceFunction - 防抖函数

用于对函数调用进行防抖处理，如 API 请求。

```tsx
import { useDebounceFunction } from "./hooks/useDebounce";

// 使用示例
const [debouncedUpdate, cancelUpdate] = useDebounceFunction(
  () => {
    // 执行更新操作
    updateData(value);
  },
  300,
  [value] // 依赖项
);
```

#### 3. useDebounceWithImmediate - 带立即执行的防抖函数

既可以防抖又可以立即执行的函数，适用于自动保存与手动保存结合的场景。

```tsx
import { useDebounceWithImmediate } from "./hooks/useDebounce";

// 使用示例
const [debouncedSave, immediateSave, cancelSave] = useDebounceWithImmediate(
  (text) => {
    saveText(text);
  },
  800,
  []
);

// 自动防抖保存
const handleChange = (e) => {
  const newText = e.target.value;
  setText(newText);
  debouncedSave(newText);
};

// 手动立即保存
<button onClick={() => immediateSave(text)}>立即保存</button>;
```

### useMaterialDrop

用于处理组件拖放功能的 Hook，基于 React DnD 实现。

```tsx
import { useMaterialDrop } from "./hooks/useMaterialDrop";

// 使用示例
const { canDrop, drop } = useMaterialDrop(acceptTypes, containerId);

// 在组件中使用
<div ref={drop} className={`${canDrop ? "drop-active" : ""}`}>
  {children}
</div>;
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```
