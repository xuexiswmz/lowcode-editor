import type { EditableMenuItem, TreeNodeItem } from "../../../types";
import { MAX_TREE_DEPTH, normalizeEditableMenuItems, normalizeEditableTreeData } from "../../../utils/normalize";
import type { TreeCollectionDefinition } from "./types";

export const menuItemsDefinition: TreeCollectionDefinition<EditableMenuItem> = {
  normalize: normalizeEditableMenuItems,
  createRoot: (nodes) => ({
    key: `menu-${nodes.length + 1}`,
    label: `菜单${nodes.length + 1}`,
    disabled: false,
  }),
  createChild: (_node, path) => ({
    key: `menu-${Date.now()}`,
    label: `菜单${path[path.length - 1] + 2}`,
    disabled: false,
  }),
  getTitle: (_node, path) =>
    `菜单项 ${path.map((itemIndex) => itemIndex + 1).join(".")}`,
  fields: [
    { key: "key", type: "input", placeholder: "key" },
    { key: "label", type: "input", placeholder: "标题" },
    { key: "disabled", type: "switch" },
  ],
  getChildren: (node) => node.children,
  setChildren: (node, children) => ({
    ...node,
    children: children && children.length > 0 ? children : undefined,
  }),
  maxDepth: MAX_TREE_DEPTH,
  addRootLabel: "新增菜单项",
};

export const treeDataDefinition: TreeCollectionDefinition<TreeNodeItem> = {
  normalize: normalizeEditableTreeData,
  createRoot: (nodes) => ({
    key: `tree-${nodes.length + 1}`,
    title: `节点${nodes.length + 1}`,
    disabled: false,
  }),
  createChild: (_node, path) => ({
    key: `tree-${Date.now()}`,
    title: `节点${path[path.length - 1] + 2}`,
    disabled: false,
  }),
  getTitle: (_node, path) =>
    `节点 ${path.map((itemIndex) => itemIndex + 1).join(".")}`,
  fields: [
    { key: "key", type: "input", placeholder: "key" },
    { key: "title", type: "input", placeholder: "标题" },
    { key: "disabled", type: "switch" },
  ],
  getChildren: (node) => node.children,
  setChildren: (node, children) => ({
    ...node,
    children: children && children.length > 0 ? children : undefined,
  }),
  maxDepth: MAX_TREE_DEPTH,
  addRootLabel: "新增根节点",
};
