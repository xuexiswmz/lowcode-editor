import type {
  BreadcrumbItem,
  DescriptionItem,
  DropdownMenuItem,
  ListDataItem,
  OptionItem,
  StepItem,
  TabsItem,
} from "../../../types";
import {
  normalizeBreadcrumbItems,
  normalizeDropdownMenuItems,
  normalizeEditableDescriptionsItems,
  normalizeEditableListDataSource,
  normalizeEditableStepItems,
  normalizeOptionItems,
  normalizeTabsItems,
} from "../../../utils/normalize";
import type { FlatCollectionDefinition } from "./types";

export const optionListDefinition: FlatCollectionDefinition<OptionItem> = {
  normalize: normalizeOptionItems,
  createItem: (items) => ({
    label: `选项${items.length + 1}`,
    value: `option${items.length + 1}`,
  }),
  getItemTitle: (_item, index) => `选项 ${index + 1}`,
  fields: [
    { key: "label", type: "input", placeholder: "标签" },
    { key: "value", type: "input", placeholder: "值" },
  ],
  addLabel: "新增选项",
  layout: "row",
};

export const breadcrumbItemsDefinition: FlatCollectionDefinition<BreadcrumbItem> = {
  normalize: normalizeBreadcrumbItems,
  createItem: (items) => ({
    title: `导航${items.length + 1}`,
    href: "",
  }),
  getItemTitle: (_item, index) => `导航 ${index + 1}`,
  fields: [
    { key: "title", type: "input", placeholder: "标题" },
    {
      key: "href",
      type: "input",
      placeholder: "链接(可选)",
      normalize: (value) => {
        const nextValue = String(value ?? "");
        return nextValue.trim() ? nextValue : undefined;
      },
    },
  ],
  addLabel: "新增项目",
  layout: "row",
};

export const stepsItemsDefinition: FlatCollectionDefinition<StepItem> = {
  normalize: normalizeEditableStepItems,
  createItem: (items) => ({
    title: `步骤${items.length + 1}`,
    description: "",
  }),
  getItemTitle: (_item, index) => `步骤 ${index + 1}`,
  fields: [
    { key: "title", type: "input", placeholder: "标题" },
    {
      key: "description",
      type: "input",
      placeholder: "描述(可选)",
      normalize: (value) => {
        const nextValue = String(value ?? "");
        return nextValue.trim() ? nextValue : undefined;
      },
    },
  ],
  addLabel: "新增步骤",
  layout: "card",
};

export const tabsItemsDefinition: FlatCollectionDefinition<TabsItem> = {
  normalize: normalizeTabsItems,
  createItem: (items) => ({
    key: `tab${items.length + 1}`,
    label: `标签${items.length + 1}`,
    children: `标签${items.length + 1}内容`,
    disabled: false,
  }),
  getItemTitle: (_item, index) => `面板 ${index + 1}`,
  fields: [
    { key: "key", type: "input", placeholder: "key" },
    { key: "label", type: "input", placeholder: "标题" },
    {
      key: "children",
      type: "textarea",
      placeholder: "内容",
      props: { autoSize: { minRows: 2, maxRows: 4 } },
      normalize: (value) => {
        const nextValue = String(value ?? "");
        return nextValue.trim() ? nextValue : undefined;
      },
    },
    { key: "disabled", type: "switch" },
  ],
  addLabel: "新增面板",
  layout: "card",
};

export const dropdownMenuItemsDefinition: FlatCollectionDefinition<DropdownMenuItem> =
  {
    normalize: normalizeDropdownMenuItems,
    createItem: (items) => ({
      key: `menu${items.length + 1}`,
      label: `菜单${items.length + 1}`,
      disabled: false,
    }),
    getItemTitle: (_item, index) => `菜单项 ${index + 1}`,
    fields: [
      { key: "key", type: "input", placeholder: "key" },
      { key: "label", type: "input", placeholder: "标题" },
      { key: "disabled", type: "switch" },
    ],
    addLabel: "新增菜单项",
    layout: "card",
  };

export const descriptionsItemsDefinition: FlatCollectionDefinition<DescriptionItem> =
  {
    normalize: normalizeEditableDescriptionsItems,
    createItem: (items) => ({
      key: `field${items.length + 1}`,
      label: `字段${items.length + 1}`,
      children: `值${items.length + 1}`,
      span: 1,
    }),
    getItemTitle: (_item, index) => `键值项 ${index + 1}`,
    fields: [
      { key: "key", type: "input", placeholder: "key" },
      { key: "label", type: "input", placeholder: "字段名" },
      {
        key: "children",
        type: "textarea",
        placeholder: "字段值",
        props: { autoSize: { minRows: 2, maxRows: 4 } },
      },
      {
        key: "span",
        type: "inputNumber",
        placeholder: "占列数",
        min: 1,
        normalize: (value) => {
          const nextValue = Number(value);
          return Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1;
        },
      },
    ],
    addLabel: "新增键值项",
    layout: "card",
  };

export const listDataSourceDefinition: FlatCollectionDefinition<ListDataItem> = {
  normalize: normalizeEditableListDataSource,
  createItem: (items) => ({
    key: `list-${items.length + 1}`,
    title: `列表项${items.length + 1}`,
    description: `这里是列表项${items.length + 1}的描述信息`,
    extra: "",
  }),
  getItemTitle: (_item, index) => `数据项 ${index + 1}`,
  fields: [
    { key: "key", type: "input", placeholder: "key" },
    { key: "title", type: "input", placeholder: "标题" },
    {
      key: "description",
      type: "textarea",
      placeholder: "描述",
      props: { autoSize: { minRows: 2, maxRows: 4 } },
    },
    { key: "extra", type: "input", placeholder: "右侧内容(可选)" },
  ],
  addLabel: "新增数据项",
  layout: "card",
};
