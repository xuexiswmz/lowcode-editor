import { Tree, type TreeDataNode } from "antd";
import { useComponentsStore } from "../../stores/components";

export default function Outline() {
  const { components, setCurComponentId } = useComponentsStore();

  return (
    <Tree
      className="lce-outline-tree"
      fieldNames={{ title: "desc", key: "id" }}
      treeData={components as unknown as TreeDataNode[]}
      showLine
      defaultExpandAll
      onSelect={([selectedKey]) => {
        setCurComponentId(selectedKey as number);
      }}
    />
  );
}
