import { forwardRef, type ForwardedRef, useMemo } from "react";
import type { CommonComponentProps } from "../../interface";
import { TREE_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { materials, Tree } from "../ui";

export interface TreeNodeConfig {
  key: string;
  title: string;
  disabled?: boolean;
  children?: TreeNodeConfig[];
}

type TreeProps = Omit<CommonComponentProps, "children"> & {
  treeData?: TreeNodeConfig[];
  defaultExpandAll?: boolean;
  selectable?: boolean;
  checkable?: boolean;
};

const defaultTreeData: TreeNodeConfig[] = [
  {
    key: "node-1",
    title: "一级节点 1",
    children: [
      { key: "node-1-1", title: "二级节点 1-1" },
      { key: "node-1-2", title: "二级节点 1-2" },
    ],
  },
  {
    key: "node-2",
    title: "一级节点 2",
    children: [
      {
        key: "node-2-1",
        title: "二级节点 2-1",
        children: [{ key: "node-2-1-1", title: "三级节点 2-1-1" }],
      },
    ],
  },
];

function normalizeTreeData(value: unknown): TreeNodeConfig[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeTreeData(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TreeNodeConfig =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "title" in item,
    )
    .map((item) => {
      const children = normalizeTreeData(item.children);

      return {
        key: String(item.key ?? ""),
        title: String(item.title ?? ""),
        disabled: Boolean(item.disabled),
        children: children.length > 0 ? children : undefined,
      };
    })
    .filter((item) => item.key.trim() && item.title.trim());
}

function TreeEmptyState({
  id,
  styles,
  message,
  treeRef,
}: {
  id: number;
  styles: CommonComponentProps["styles"];
  message: string;
  treeRef: ForwardedRef<HTMLDivElement>;
}) {
  return (
    <div
      ref={treeRef}
      data-component-id={id}
      style={{
        minHeight: 120,
        padding: 16,
        border: "1px dashed #d9d9d9",
        borderRadius: 8,
        background: "#fafafa",
        color: "#999",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      }}
    >
      {message}
    </div>
  );
}

const TreeRenderer = forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      id,
      treeData,
      defaultExpandAll = true,
      selectable = true,
      checkable = false,
      styles,
      onSelect,
      onCheck,
      onExpand,
      ...props
    },
    ref,
  ) => {
    const normalizedTreeData = useMemo(
      () => normalizeTreeData(treeData ?? defaultTreeData),
      [treeData],
    );

    if (normalizedTreeData.length === 0) {
      return (
        <TreeEmptyState
          id={id}
          styles={styles}
          message="请先在右侧配置 Tree 节点"
          treeRef={ref}
        />
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <Tree
          {...materials.Tree.mapProps(
            {
              treeData: normalizedTreeData,
              defaultExpandAll,
              selectable,
              checkable,
              onSelect,
              onCheck,
              onExpand,
              styles,
              ...props,
            },
            { mode: "preview" },
          )}
        />
      </div>
    );
  },
);

const TreeEditorRenderer = forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      id,
      treeData,
      defaultExpandAll = true,
      selectable = true,
      checkable = false,
      styles,
      onSelect,
      onCheck,
      onExpand,
      ...props
    },
    ref,
  ) => {
    const normalizedTreeData = useMemo(
      () => normalizeTreeData(treeData ?? defaultTreeData),
      [treeData],
    );

    if (normalizedTreeData.length === 0) {
      return (
        <TreeEmptyState
          id={id}
          styles={styles}
          message="请先在右侧新增 Tree 节点"
          treeRef={ref}
        />
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <Tree
          {...materials.Tree.mapProps(
            {
              treeData: normalizedTreeData,
              defaultExpandAll,
              selectable,
              checkable,
              onSelect,
              onCheck,
              onExpand,
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        />
      </div>
    );
  },
);

TreeRenderer.displayName = "TreeRenderer";
TreeEditorRenderer.displayName = "TreeEditorRenderer";

export default createLeafMaterial({
  name: "Tree",
  category: "display",
  desc: "树形控件",
  defaultProps: {
    treeData: defaultTreeData,
    defaultExpandAll: true,
    selectable: true,
    checkable: false,
  },
  allowedParents: [...TREE_ALLOWED_PARENTS],
  setter: [
    field.treeData("treeData", "树数据"),
    field.switch("defaultExpandAll", "默认展开"),
    field.switch("selectable", "可选中"),
    field.switch("checkable", "可勾选"),
  ],
  events: [
    { name: "onSelect", label: "选中事件" },
    { name: "onCheck", label: "勾选事件" },
    { name: "onExpand", label: "展开事件" },
  ],
  render: TreeRenderer,
  renderInEditor: TreeEditorRenderer,
});
