第一步：重构 collections.tsx，按编辑范式拆分

做什么：

把 collections.tsx (line 1) 从“业务集合”改成“编辑范式集合”。
不要再按 TabsItemsSetter / BreadcrumbItemsSetter / ListDataSourceSetter 这种业务命名扩展。
怎么做：

新建目录：
src/components/Setting/ComponentAttr/setters/collections/flat
src/components/Setting/ComponentAttr/setters/collections/tree
src/components/Setting/ComponentAttr/setters/collections/table

迁移这些 setter 到 flat：
OptionListSetter
BreadcrumbItemsSetter
StepsItemsSetter
TabsItemsSetter
DropdownMenuItemsSetter
DescriptionsItemsSetter
ListDataSourceSetter

迁移这些 setter 到 tree：
MenuItemsSetter
TreeDataSetter

迁移这些 setter 到 table：
TableColumnsSetter
TableDataSourceSetter
TableActionsSetter

修改 setter-registry.ts (line 1) 的导入路径，但先不改外部行为。

为什么先做这步：

这是最低风险的结构整理。
它能立刻把“集合类 setter”分成三种不同复杂度的域，后面抽象时更清晰。
验收标准：

collections.tsx 不再保留成一个 1000+ 行文件。
flat/tree/table 三类 setter 有独立入口。
页面行为不变。
第二步：抽离集合通用操作层，停止在组件内部手写 map/filter/splice

做什么：

把集合编辑动作抽成纯函数，不再散落在每个 setter 组件内部。
怎么做：

新建：
flat/collection-ops.ts
tree/tree-ops.ts

在 flat 里统一提供：
updateItemAtIndex
removeItemAtIndex
appendItem
insertItemAfter

在 tree 里统一提供：
updateNodeAtPath
removeNodeAtPath
insertSiblingAtPath
appendChildAtPath

把 MenuItemsSetter (line 431) 和 TreeDataSetter (line 1242) 内部递归算法先迁到 tree-ops.ts。

把所有 flat setter 里的 updateAt / removeItem / addItem 统一改为调用 collection-ops.ts。

为什么这步重要：

这一步之后，集合 setter 组件才会真正变薄。
纯函数操作层可以单测，后面也能给 undo/redo 或命令层复用。
验收标准：

setter 组件内部不再直接维护复杂数组和树递归算法。
Menu 和 Tree 共用同一套树操作函数。
OptionList/Breadcrumb/List/Descriptions/Tabs/Steps 共用同一套平面集合操作函数。
第三步：引入 FlatCollectionDefinition 和 TreeCollectionDefinition，把简单 setter 改成 definition 驱动

做什么：

把现在多个高度相似的 flat setter，改造成“同一个通用组件 + 不同 definition”。
怎么做：

新建：
flat/types.ts
flat/FlatCollectionSetter.tsx

定义：
FlatCollectionDefinition<T>
字段包括：
normalize
createItem
getItemTitle
fields

第一批接入 definition 驱动的 setter：
OptionList
BreadcrumbItems
StepsItems
TabsItems
DropdownMenuItems
DescriptionsItems
ListDataSource

每个业务 setter 只保留一个 definition 文件，例如：
definitions/tabs.ts
definitions/breadcrumb.ts
definitions/descriptions.ts

setter-registry 仍然按原 type 注册，但实现改为：
“读取 definition -> 交给 FlatCollectionSetter 渲染”。

为什么这步重要：

你后面再新增一个“数组卡片编辑型” setter，基本只需要定义字段，不需要再写完整 React 组件。
这才是真正提升可扩展性的关键一步。
验收标准：

flat 类 setter 不再各自维护一整套 UI 结构。
新增一个 flat collection setter 时，不需要复制一整个组件文件。
第四步：把树形集合也改成 definition 驱动

做什么：

让 MenuItemsSetter 和 TreeDataSetter 共享一个统一的 TreeCollectionSetter。
怎么做：

新建：
tree/types.ts
tree/TreeCollectionSetter.tsx

定义：
TreeCollectionDefinition<T>
字段包括：
normalize
createRoot
createChild
getTitle
fields
getChildren
setChildren
maxDepth

给 Menu 和 Tree 分别写 definition：
definitions/menu.ts
definitions/tree.ts

把现在两套递归渲染逻辑收敛到 TreeCollectionSetter。

为什么这步重要：

Menu 和 Tree 现在的差异主要在字段模型，不在编辑算法。
统一后，后面新增目录树、组织树、分类树这类 setter 成本会很低。
验收标准：

MenuItemsSetter 和 TreeDataSetter 可以被 definition 包装或直接替代。
树形编辑的 UI 和算法只保留一份。
第五步：重构 useComponentForm.ts，引入 material adapter，把组件规则下沉

做什么：

把 useComponentForm.ts (line 1) 从“组件规则中心”改成“调度器”。
怎么做：

扩展 ComponentConfig (line 36)，新增：
propsAdapter?: ComponentPropsAdapter

定义：
toFormValues(props, defaultProps)
fromFormPatch(patch, prevProps)

优先给这些组件加 adapter：
Select
Tabs
Menu
Table
Tree
DatePicker

把现在 useComponentForm.ts 里的分支逐步迁出：
getFormValues 里对应逻辑迁到 adapter 的 toFormValues
handleValuesChange 里对应逻辑迁到 adapter 的 fromFormPatch

useComponentForm.ts 最终只保留：
读取当前组件
拿 config.propsAdapter
执行 form.setFieldsValue
执行 updateComponentProps

为什么这步重要：

这是清掉中心化 if (componentName === ...) 的根本方案。
组件的编辑规则应当和组件自身配置放在一起，而不是放在属性面板 hook 里。
验收标准：

useComponentForm.ts 的组件名分支显著减少。
Table/Menu/Tabs/Tree/DatePicker/Select 的规则能在各自 material 侧找到。
第六步：升级 ComponentSetter，让 setter 支持声明式能力

做什么：

提升 ComponentSetter (line 8) 的表达能力，减少 basic.tsx (line 1) 里的特判。
怎么做：

在 ComponentSetter 上增加：
props
visible
disabled
deriveOptions
collection

给 Select.value、Tabs.activeKey、Menu.selectedKeys 这类动态 options 字段，优先改成 deriveOptions。

给集合类字段补 collection 定义，让 material 能直接声明“这个字段是 flat/tree/table collection”。

逐步减少 BasicSelectSetter (line 16) 和 BasicInputNumberSetter (line 103) 中的组件名特判。

为什么这步重要：

这一步做完后，setter 才算真正 schema 化。
新组件的编辑行为会越来越偏配置，而不是偏硬编码。
验收标准：

basic.tsx 里的 componentName + name 特判明显减少。
material 配置能直接描述更多编辑行为。
第七步：清理 normalize 的重复定义，建立共享与组件专属边界

做什么：

解决当前 normalize 分散和重复的问题，避免后续漂移。
怎么做：

把真正通用的 normalize 留在：
src/materials/shared/*
或
src/components/Setting/ComponentAttr/utils/*

把组件专属且涉及多字段联动的 normalize，迁到对应 material adapter。

重点清理：
Table 面板 normalize 与 material normalize 的重复
Menu 面板 normalize 与 material normalize 的重复

给 normalize 分两类命名：
normalizeXxxValue：纯值清洗
adaptXxxPropsToForm / adaptXxxPatchFromForm：组件级转换

为什么这步重要：

现在 Table/Menu 两边都在维护 normalize 逻辑，长期一定会偏。
共享工具和组件专属 adapter 必须分界清楚。
验收标准：

同一套语义不再同时出现在面板层和 material 层。
normalize 的归属清晰可判断。
推荐实施顺序

先拆 collections.tsx 为 flat/tree/table。
再抽 collection-ops 和 tree-ops。
再把 flat setter 改成 definition 驱动。
再把 tree setter 改成 definition 驱动。
然后给 ComponentConfig 加 propsAdapter，清理 useComponentForm.ts。
最后升级 ComponentSetter，做 setter schema 声明式增强。
收尾时统一清理 normalize 的重复定义。