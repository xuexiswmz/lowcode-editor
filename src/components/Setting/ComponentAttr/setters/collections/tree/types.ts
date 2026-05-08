export type TreeCollectionFieldType = "input" | "switch";

export interface TreeCollectionField<TNode> {
  key: keyof TNode & string;
  type: TreeCollectionFieldType;
  placeholder?: string;
  normalize?: (value: unknown, node: TNode) => unknown;
}

export interface TreeCollectionDefinition<TNode> {
  normalize: (value: unknown) => TNode[];
  createRoot: (nodes: TNode[]) => TNode;
  createChild: (node: TNode, path: number[]) => TNode;
  getTitle: (node: TNode, path: number[]) => string;
  fields: TreeCollectionField<TNode>[];
  getChildren: (node: TNode) => TNode[] | undefined;
  setChildren: (node: TNode, children: TNode[] | undefined) => TNode;
  maxDepth: number;
  addRootLabel: string;
}
