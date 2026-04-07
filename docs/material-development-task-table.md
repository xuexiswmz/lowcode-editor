# 低代码编辑器材料组件开发任务表

## 1. 文档目标

这份文档用于规划当前低代码编辑器的材料组件建设顺序，并约束后续组件开发时的配置结构、编辑器能力依赖和落地方式。

当前项目已经具备以下基础能力：

- 材料组件按目录拆分，当前以 `material.tsx` 为主入口
- 组件配置支持 `setter / stylesSetter / events / methods`
- 组件配置支持 `allowedParents / isContainer`
- 材料注册由 `src/materials/registry.ts` 统一维护
- 画布拖拽、属性面板、样式面板、事件面板已具备基础能力
- 物料渲染已接入 `src/materials/ui` 适配层，可逐步脱离具体组件库

当前已完成的基础组件：

- `Page`
- `Container`
- `Text`
- `Button`
- `Divider`
- `Input`
- `Form`
- `FormItem`
- `Modal`
- `Image`

## 2. 开发原则

### 2.1 组件分类约束

- 展示型组件默认 `isContainer: false`
- 容器型组件必须声明 `isContainer: true`
- 所有组件必须通过 `allowedParents` 声明允许挂载到哪些父组件
- 所有配置统一放在组件目录下的 `config.tsx`

### 2.2 事件与方法约束

- 输入类组件优先统一为 `onChange`
- 浮层类组件优先统一暴露 `open / close`
- 展示型组件通常只保留必要事件，不提前设计过多方法

### 2.3 配置设计约束

- 简单枚举值优先使用 `select`
- 布尔值统一使用 `switch`
- 数组型配置尽量复用统一 setter 设计
- 涉及复杂嵌套结构时，优先建设通用配置编辑器，再做组件
- schema 字段优先表达低代码语义，不要在物料层直接绑定具体 UI 库 props
- 组件库差异优先收敛到 `src/materials/ui` 适配层，而不是散落在每个物料里

## 3. 推荐整体排期

建议按以下顺序推进：

1. 第一批：通用类 + 简单布局类
2. 第二批：简单表单类
3. 第三批：导航类
4. 第四批：数据展示类
5. 第五批：高交互组件

更细的推荐落地顺序：

1. `Link`
2. `Tag`
3. `Avatar`
4. `Space`
5. `Card`
6. `Flex`
7. `Textarea`
8. `Radio`
9. `Checkbox`
10. `Switch`
11. `Select`
12. `Breadcrumb`
13. `Steps`
14. `Tabs`
15. `Descriptions`
16. `Badge`
17. `Progress`
18. `List`
19. `Drawer`
20. `Tooltip`
21. `Popover`
22. `Table`
23. `Upload`
24. `Tree`
25. `Menu`

`Row / Col` 可以在 `Flex` 之后补，也可以等布局需求明确后再插入。

## 4. 开发任务表

说明：

- 难度分级：`S / M / L / XL`
- `props` 只列建议优先支持的核心字段
- `前置依赖` 指组件实现前建议先具备的编辑器或基础能力
- `脚手架` 表示是否建议先通过 `npm run generate:material` 生成基础文件

当前脚手架会生成新的物料模板：

- 单文件 `material.tsx`
- 包含 `render` 和 `renderInEditor`
- 使用 `createLeafMaterial / createContainerMaterial`
- 默认不直接依赖具体组件库

### 4.1 第一批：通用类 + 简单布局类

| 组件 | 分类 | 核心 props | events | methods | 难度 | allowedParents | 前置依赖 | 脚手架 | 命令示例 |
|---|---|---|---|---|---|---|---|---|---|
| `Link` | 通用 | `text href target underline disabled` | `onClick` | - | S | `Page Container Modal Card Flex Space` | 复用文本配置；枚举 setter | 是 | `npm run generate:material -- Link --desc=链接` |
| `Icon` | 通用 | `name size color spin` | `onClick` | - | S | `Page Container Modal Card Flex Space Button` | 图标枚举来源管理 | 是 | `npm run generate:material -- Icon --desc=图标` |
| `Tag` | 通用 | `text color bordered closable` | `onClose` | - | S | `Page Container Modal Card Flex Space` | 颜色枚举；状态类配置 | 是 | `npm run generate:material -- Tag --desc=标签` |
| `Avatar` | 通用 | `src text size shape` | `onClick` | - | S | `Page Container Modal Card Flex Space` | 图片兜底；文本兜底 | 是 | `npm run generate:material -- Avatar --desc=头像` |
| `Space` | 布局 | `direction size align wrap` | - | - | S | `Page Container Modal Card Drawer` | 容器组件能力；间距样式统一 | 是 | `npm run generate:material -- Space --desc=间距 --container` |
| `Card` | 布局 | `title extra bordered size hoverable` | `onClick` | - | M | `Page Container Modal Drawer` | 容器布局；标题区与内容区拆分 | 是 | `npm run generate:material -- Card --desc=卡片 --container --parents=Page,Container,Modal,Drawer` |
| `Flex` | 布局 | `vertical justify align gap wrap` | - | - | M | `Page Container Modal Card Drawer` | 现代布局能力；gap 配置 | 是 | `npm run generate:material -- Flex --desc=弹性布局 --container --parents=Page,Container,Modal,Card,Drawer` |
| `Row` | 布局 | `gutter justify align wrap` | - | - | M | `Page Container Modal Card Drawer` | 栅格系统设计 | 是 | `npm run generate:material -- Row --desc=栅格行 --container --parents=Page,Container,Modal,Card,Drawer` |
| `Col` | 布局 | `span offset order flex` | - | - | M | `Row` | 依赖 `Row` 配套实现 | 是 | `npm run generate:material -- Col --desc=栅格列 --container --parents=Row` |

### 4.2 第二批：简单表单类

| 组件 | 分类 | 核心 props | events | methods | 难度 | allowedParents | 前置依赖 | 脚手架 | 命令示例 |
|---|---|---|---|---|---|---|---|---|---|
| `Textarea` | 数据录入 | `value placeholder rows maxLength disabled` | `onChange onFocus onBlur` | `focus blur` | S | `Page Container Modal Card Form` | 复用 `Input` 结构 | 是 | `npm run generate:material -- Textarea --desc=多行输入` |
| `Radio` | 数据录入 | `value options optionType disabled` | `onChange` | - | M | `Page Container Modal Card Form` | 数组选项编辑器 | 是 | `npm run generate:material -- Radio --desc=单选框` |
| `Checkbox` | 数据录入 | `value options disabled` | `onChange` | - | M | `Page Container Modal Card Form` | 数组选项编辑器 | 是 | `npm run generate:material -- Checkbox --desc=多选框` |
| `Switch` | 数据录入 | `checked checkedChildren unCheckedChildren disabled` | `onChange` | `focus blur` | S | `Page Container Modal Card Form` | 布尔型 setter | 是 | `npm run generate:material -- Switch --desc=开关` |
| `Select` | 数据录入 | `value options mode placeholder disabled allowClear` | `onChange onSelect onSearch` | `focus blur clear` | M | `Page Container Modal Card Form` | 数组选项编辑器；多选配置 | 是 | `npm run generate:material -- Select --desc=选择器` |
| `DatePicker` | 数据录入 | `value picker format placeholder disabled` | `onChange onOpenChange` | `focus blur` | L | `Page Container Modal Card Form` | 日期序列化与格式化 | 是 | `npm run generate:material -- DatePicker --desc=日期选择` |
| `Upload` | 数据录入 | `action listType maxCount accept multiple` | `onChange onPreview onRemove` | `clear` | XL | `Page Container Modal Card Form` | 文件状态管理；上传回调 | 是 | `npm run generate:material -- Upload --desc=上传` |

### 4.3 第三批：导航类

| 组件 | 分类 | 核心 props | events | methods | 难度 | allowedParents | 前置依赖 | 脚手架 | 命令示例 |
|---|---|---|---|---|---|---|---|---|---|
| `Breadcrumb` | 导航 | `items separator` | `onClick` | - | S | `Page Container Modal Card` | 数组型配置编辑器 | 是 | `npm run generate:material -- Breadcrumb --desc=面包屑` |
| `Steps` | 导航 | `current direction size items status` | `onChange` | - | M | `Page Container Modal Card` | 数组型配置编辑器 | 是 | `npm run generate:material -- Steps --desc=步骤条` |
| `Tabs` | 导航 | `items activeKey type tabPosition centered` | `onChange onTabClick` | `switchTab` | L | `Page Container Modal Drawer` | 子面板配置；activeKey 管理 | 是 | `npm run generate:material -- Tabs --desc=标签页 --container --parents=Page,Container,Modal,Drawer` |
| `Dropdown` | 导航 | `menu trigger placement disabled` | `onOpenChange onClick` | `open close` | L | `Page Container Modal Card` | 浮层能力；菜单项配置 | 是 | `npm run generate:material -- Dropdown --desc=下拉菜单` |
| `Menu` | 导航 | `items mode selectedKeys theme inlineCollapsed` | `onClick onSelect onOpenChange` | - | XL | `Page Container Modal Drawer` | 递归菜单配置器 | 是 | `npm run generate:material -- Menu --desc=菜单 --container --parents=Page,Container,Modal,Drawer` |

### 4.4 第四批：数据展示类

| 组件 | 分类 | 核心 props | events | methods | 难度 | allowedParents | 前置依赖 | 脚手架 | 命令示例 |
|---|---|---|---|---|---|---|---|---|---|
| `Descriptions` | 数据展示 | `items title column bordered size` | - | - | M | `Page Container Modal Card` | 键值数组配置 | 是 | `npm run generate:material -- Descriptions --desc=描述列表` |
| `Badge` | 数据展示 | `count status text color dot` | - | - | S | `Page Container Modal Card Flex Space` | 状态枚举 | 是 | `npm run generate:material -- Badge --desc=徽标数` |
| `Progress` | 数据展示 | `percent status type strokeColor showInfo` | - | - | S | `Page Container Modal Card Flex Space` | 数值类型 setter | 是 | `npm run generate:material -- Progress --desc=进度条` |
| `List` | 数据展示 | `dataSource itemLayout bordered size header footer` | `onClick` | - | L | `Page Container Modal Card Drawer` | 数据源配置；列表项模板设计 | 是 | `npm run generate:material -- List --desc=列表 --container --parents=Page,Container,Modal,Card,Drawer` |
| `Table` | 数据展示 | `columns dataSource bordered size pagination rowKey` | `onChange onRowClick` | - | XL | `Page Container Modal Card Drawer` | 列编辑器；数据源编辑器；渲染策略 | 是 | `npm run generate:material -- Table --desc=表格 --container --parents=Page,Container,Modal,Card,Drawer` |
| `Tree` | 数据展示 | `treeData defaultExpandAll selectable checkable` | `onSelect onCheck onExpand` | - | XL | `Page Container Modal Card Drawer` | 递归数据结构配置 | 是 | `npm run generate:material -- Tree --desc=树形控件 --container --parents=Page,Container,Modal,Card,Drawer` |

### 4.5 第五批：反馈类

| 组件 | 分类 | 核心 props | events | methods | 难度 | allowedParents | 前置依赖 | 脚手架 | 命令示例 |
|---|---|---|---|---|---|---|---|---|---|
| `Alert` | 反馈 | `message description type closable showIcon banner` | `onClose` | - | S | `Page Container Modal Card Flex Space` | 状态枚举 | 是 | `npm run generate:material -- Alert --desc=警告提示` |
| `Spin` | 反馈 | `spinning tip size fullscreen` | - | - | S | `Page Container Modal Card Flex Space` | 简单辅助配置 | 是 | `npm run generate:material -- Spin --desc=加载中` |
| `Tooltip` | 反馈 | `title placement color trigger` | `onOpenChange` | `open close` | M | `Page Container Modal Card Flex Space Button` | 浮层能力 | 是 | `npm run generate:material -- Tooltip --desc=文字提示` |
| `Popover` | 反馈 | `title content placement trigger` | `onOpenChange` | `open close` | M | `Page Container Modal Card Flex Space Button` | 浮层能力；内容区配置 | 是 | `npm run generate:material -- Popover --desc=气泡卡片` |
| `Drawer` | 反馈 | `title placement width open mask closable` | `onClose` | `open close` | L | `Page` | 复用 `Modal` 方法协议 | 是 | `npm run generate:material -- Drawer --desc=抽屉 --container --parents=Page` |
| `Message` | 反馈 | `type content duration` | - | `open success error info warning` | M | - | 更适合作为动作系统能力而非材料 | 否 | 建议实现为事件动作，不走材料脚手架 |

## 5. 每一批之前建议先补的编辑器能力

### 5.1 数组选项编辑器

适用组件：

- `Radio`
- `Checkbox`
- `Select`
- `Breadcrumb`
- `Steps`
- `Dropdown`

建议能力：

- 支持增删改排序
- 每项至少支持 `label / value`
- 后续可扩展 `disabled / icon / children`

### 5.2 结构化 items 编辑器

适用组件：

- `Tabs`
- `Descriptions`
- `List`
- `Table`
- `Menu`
- `Tree`

建议能力：

- 支持对象数组编辑
- 支持嵌套字段
- 支持 JSON 模式与表单模式切换

### 5.3 浮层组件统一协议

适用组件：

- `Modal`
- `Drawer`
- `Tooltip`
- `Popover`
- `Dropdown`

建议约束：

- 统一暴露 `open / close`
- 尽量统一使用 `open` 作为状态字段
- 统一 `onOpenChange` 或 `onClose` 的事件接口

### 5.4 数据源与序列化能力

适用组件：

- `DatePicker`
- `List`
- `Table`
- `Tree`
- `Upload`

建议能力：

- 支持静态数组数据源
- 支持 JSON 编辑
- 支持日期序列化
- 支持复杂对象字段映射

### 5.5 容器分区能力

适用组件：

- `Card`
- `Tabs`
- `Drawer`

建议能力：

- 支持标题区和内容区
- 支持分区型 children 配置
- 避免所有内容都挤在单一默认槽位

## 6. 推荐实际实施顺序

基于当前项目结构，建议按下面顺序逐步推进：

### 6.1 第一阶段

- `Link`
- `Tag`
- `Avatar`
- `Space`
- `Card`
- `Flex`

目标：

- 打通轻量展示组件
- 验证容器组件配置方式
- 建立一致的 `allowedParents` 设计

### 6.2 第二阶段

- `Textarea`
- `Radio`
- `Checkbox`
- `Switch`
- `Select`

目标：

- 打通表单类基础能力
- 建立数组选项类 setter 的统一方案

### 6.3 第三阶段

- `Breadcrumb`
- `Steps`
- `Tabs`

目标：

- 建立数组项和子面板配置能力
- 为后续更复杂导航组件打基础

### 6.4 第四阶段

- `Descriptions`
- `Badge`
- `Progress`
- `List`

目标：

- 打通静态展示和简单数据展示组件
- 验证数据源配置方式

### 6.5 第五阶段

- `Drawer`
- `Tooltip`
- `Popover`

目标：

- 统一浮层组件能力
- 复用现有 `Modal` 的方法和事件模型

### 6.6 第六阶段

- `Table`
- `Upload`
- `Tree`
- `Menu`

目标：

- 攻克复杂结构和高交互组件
- 完成编辑器高级能力闭环

## 7. 组件开发模板建议

以后新增材料组件时，建议至少包含以下内容：

### 7.1 基础文件

- `dev.tsx`
- `prod.tsx`
- `config.tsx`

### 7.2 config.tsx 建议结构

```ts
import DemoDev from "./dev";
import DemoProd from "./prod";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Demo",
  desc: "示例组件",
  defaultProps: {},
  allowedParents: ["Page", "Container", "Modal"],
  isContainer: false,
  setter: [],
  stylesSetter: [],
  events: [],
  methods: [],
  dev: DemoDev,
  prod: DemoProd,
};

export default config;
```

### 7.3 设计建议

- 简单组件优先让 `setter` 小而稳定
- 样式优先通过 `stylesSetter` 提供常用配置
- 不要一开始就塞太多事件和方法
- 先保证编辑态可识别、可拖拽、可配置，再做复杂交互

## 8. 脚手架使用建议

### 8.1 适合直接用脚手架起步的组件

- 通用展示组件：`Link / Icon / Tag / Avatar / Badge / Progress / Alert / Spin`
- 简单输入组件：`Textarea / Radio / Checkbox / Switch / Select`
- 常规容器组件：`Space / Card / Flex / Row / Col / Tabs / List / Drawer`

这些组件都适合先用脚手架生成，再逐步补 `props / setter / events / methods`。

### 8.2 不建议只靠脚手架完成的组件

- `Table`
- `Tree`
- `Menu`
- `Upload`
- `Message`

原因：

- 这些组件通常依赖复杂数据结构或全局能力
- 仅生成基础三件套还不够，往往还要先补编辑器基础设施

### 8.3 常用命令模板

普通组件：

```bash
npm run generate:material -- Link --desc=链接
```

容器组件：

```bash
npm run generate:material -- Card --desc=卡片 --container --parents=Page,Container,Modal,Drawer
```

仅预览不生成：

```bash
npm run generate:material -- Tabs --desc=标签页 --container --parents=Page,Container,Modal,Drawer --dry-run
```

使用 npm 参数形式：

```bash
npm run generate:material -- --name=Avatar --desc=头像 --dry-run
```

## 9. 当前最值得优先处理的公共能力

如果只选几个最能提升后续开发效率的能力，建议优先做这几个：

1. 数组选项编辑器
2. 结构化 items 编辑器
3. 浮层统一协议
4. 数据源 JSON 编辑器
5. 容器分区能力

这五项补齐后，后续大多数组件都能明显更快落地。
