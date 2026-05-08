export function updateNodeAtPath<T>(
  nodes: T[],
  path: number[],
  getChildren: (node: T) => T[] | undefined,
  setChildren: (node: T, children: T[] | undefined) => T,
  updater: (node: T) => T,
): T[] {
  return nodes.map((node, index) => {
    if (index !== path[0]) {
      return node;
    }

    if (path.length === 1) {
      return updater(node);
    }

    return setChildren(
      node,
      updateNodeAtPath(
        getChildren(node) ?? [],
        path.slice(1),
        getChildren,
        setChildren,
        updater,
      ),
    );
  });
}

export function removeNodeAtPath<T>(
  nodes: T[],
  path: number[],
  getChildren: (node: T) => T[] | undefined,
  setChildren: (node: T, children: T[] | undefined) => T,
): T[] {
  if (path.length === 1) {
    return nodes.filter((_, index) => index !== path[0]);
  }

  return nodes.map((node, index) => {
    if (index !== path[0]) {
      return node;
    }

    const nextChildren = removeNodeAtPath(
      getChildren(node) ?? [],
      path.slice(1),
      getChildren,
      setChildren,
    );

    return setChildren(node, nextChildren.length > 0 ? nextChildren : undefined);
  });
}

export function insertSiblingAtPath<T>(
  nodes: T[],
  path: number[],
  getChildren: (node: T) => T[] | undefined,
  setChildren: (node: T, children: T[] | undefined) => T,
  nextNode: T,
): T[] {
  if (path.length === 1) {
    const nextNodes = [...nodes];
    nextNodes.splice(path[0] + 1, 0, nextNode);
    return nextNodes;
  }

  return updateNodeAtPath(
    nodes,
    path.slice(0, -1),
    getChildren,
    setChildren,
    (node) => {
      const nextChildren = [...(getChildren(node) ?? [])];
      nextChildren.splice(path[path.length - 1] + 1, 0, nextNode);
      return setChildren(node, nextChildren);
    },
  );
}

export function appendChildAtPath<T>(
  nodes: T[],
  path: number[],
  getChildren: (node: T) => T[] | undefined,
  setChildren: (node: T, children: T[] | undefined) => T,
  nextNode: T,
): T[] {
  return updateNodeAtPath(nodes, path, getChildren, setChildren, (node) =>
    setChildren(node, [...(getChildren(node) ?? []), nextNode]),
  );
}
