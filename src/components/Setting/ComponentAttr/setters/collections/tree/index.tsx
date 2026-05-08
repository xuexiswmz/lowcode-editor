import type { SetterRendererProps } from "../../../types";
import { TreeCollectionSetter } from "./TreeCollectionSetter";
import { menuItemsDefinition, treeDataDefinition } from "./definitions";

export function MenuItemsSetter(props: SetterRendererProps<unknown>) {
  return <TreeCollectionSetter {...props} definition={menuItemsDefinition} />;
}

export function TreeDataSetter(props: SetterRendererProps<unknown>) {
  return <TreeCollectionSetter {...props} definition={treeDataDefinition} />;
}
