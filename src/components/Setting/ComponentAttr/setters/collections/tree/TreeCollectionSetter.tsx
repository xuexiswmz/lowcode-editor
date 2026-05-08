import { Button, Input, Switch } from "antd";
import type { SetterRendererProps } from "../../../types";
import {
  appendChildAtPath,
  insertSiblingAtPath,
  removeNodeAtPath,
  updateNodeAtPath,
} from "./tree-ops";
import type { TreeCollectionDefinition, TreeCollectionField } from "./types";

function normalizeFieldValue<TNode>(
  field: TreeCollectionField<TNode>,
  value: unknown,
  node: TNode,
) {
  return field.normalize ? field.normalize(value, node) : value;
}

function renderField<TNode extends object>(
  field: TreeCollectionField<TNode>,
  node: TNode,
  onChange: (value: unknown) => void,
) {
  if (field.type === "switch") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={{ color: "#666", fontSize: 12 }}>禁用</span>
        <Switch
          checked={Boolean(node[field.key])}
          onChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }

  return (
    <Input
      placeholder={field.placeholder}
      value={String(node[field.key] ?? "")}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function TreeCollectionSetter<TNode extends object>({
  value,
  onChange,
  definition,
}: SetterRendererProps<unknown> & {
  definition: TreeCollectionDefinition<TNode>;
}) {
  const nodes = definition.normalize(value);

  function updateField(
    path: number[],
    field: TreeCollectionField<TNode>,
    nextValue: unknown,
  ) {
    onChange?.(
      updateNodeAtPath(
        nodes,
        path,
        definition.getChildren,
        definition.setChildren,
        (node) => ({
          ...node,
          [field.key]: normalizeFieldValue(field, nextValue, node),
        }),
      ),
    );
  }

  function addRoot() {
    onChange?.([...nodes, definition.createRoot(nodes)]);
  }

  function addSibling(path: number[]) {
    const currentNode = path.reduce<TNode | undefined>(
      (current, index, currentDepth) =>
        currentDepth === 0
          ? nodes[index]
          : current
            ? definition.getChildren(current)?.[index]
            : undefined,
      undefined,
    );

    if (!currentNode) {
      return;
    }

    onChange?.(
      insertSiblingAtPath(
        nodes,
        path,
        definition.getChildren,
        definition.setChildren,
        definition.createChild(currentNode, path),
      ),
    );
  }

  function addChild(path: number[]) {
    const currentNode = path.reduce<TNode | undefined>(
      (current, index, currentDepth) =>
        currentDepth === 0
          ? nodes[index]
          : current
            ? definition.getChildren(current)?.[index]
            : undefined,
      undefined,
    );

    if (!currentNode) {
      return;
    }

    onChange?.(
      appendChildAtPath(
        nodes,
        path,
        definition.getChildren,
        definition.setChildren,
        definition.createChild(currentNode, path),
      ),
    );
  }

  function removeNode(path: number[]) {
    onChange?.(
      removeNodeAtPath(
        nodes,
        path,
        definition.getChildren,
        definition.setChildren,
      ),
    );
  }

  function renderNodes(items: TNode[], parentPath: number[] = []) {
    return items.map((node, index) => {
      const path = [...parentPath, index];
      const currentDepth = path.length;
      const canAddChild = currentDepth < definition.maxDepth;
      const children = definition.getChildren(node);

      return (
        <div
          key={path.join("-")}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              {definition.getTitle(node, path)}
            </span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Button size="small" type="text" onClick={() => addSibling(path)}>
                新增同级
              </Button>
              <Button
                size="small"
                type="text"
                disabled={!canAddChild}
                onClick={() => addChild(path)}
              >
                新增子级
              </Button>
              <Button danger size="small" type="text" onClick={() => removeNode(path)}>
                删除
              </Button>
            </div>
          </div>
          {!canAddChild ? (
            <div style={{ color: "#999", fontSize: 12 }}>
              已达到最大层级限制，最多支持 {definition.maxDepth} 层
            </div>
          ) : null}
          {definition.fields.map((field) =>
            renderField(field, node, (nextValue) =>
              updateField(path, field, nextValue),
            ),
          )}
          {children && children.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: 8,
                minWidth: 0,
                paddingLeft: 12,
                marginLeft: 4,
                borderLeft: "2px solid #f0f0f0",
              }}
            >
              {renderNodes(children, path)}
            </div>
          ) : null}
        </div>
      );
    });
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {renderNodes(nodes)}
      <Button type="dashed" block onClick={addRoot}>
        {definition.addRootLabel}
      </Button>
    </div>
  );
}
