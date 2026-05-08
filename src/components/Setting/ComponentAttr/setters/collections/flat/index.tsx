import type { SetterRendererProps } from "../../../types";
import { FlatCollectionSetter } from "./FlatCollectionSetter";
import {
  breadcrumbItemsDefinition,
  descriptionsItemsDefinition,
  dropdownMenuItemsDefinition,
  listDataSourceDefinition,
  optionListDefinition,
  stepsItemsDefinition,
  tabsItemsDefinition,
} from "./definitions";

export function OptionListSetter(props: SetterRendererProps<unknown>) {
  return <FlatCollectionSetter {...props} definition={optionListDefinition} />;
}

export function BreadcrumbItemsSetter(props: SetterRendererProps<unknown>) {
  return (
    <FlatCollectionSetter {...props} definition={breadcrumbItemsDefinition} />
  );
}

export function StepsItemsSetter(props: SetterRendererProps<unknown>) {
  return <FlatCollectionSetter {...props} definition={stepsItemsDefinition} />;
}

export function TabsItemsSetter(props: SetterRendererProps<unknown>) {
  return <FlatCollectionSetter {...props} definition={tabsItemsDefinition} />;
}

export function DropdownMenuItemsSetter(props: SetterRendererProps<unknown>) {
  return (
    <FlatCollectionSetter
      {...props}
      definition={dropdownMenuItemsDefinition}
    />
  );
}

export function DescriptionsItemsSetter(props: SetterRendererProps<unknown>) {
  return (
    <FlatCollectionSetter
      {...props}
      definition={descriptionsItemsDefinition}
    />
  );
}

export function ListDataSourceSetter(props: SetterRendererProps<unknown>) {
  return <FlatCollectionSetter {...props} definition={listDataSourceDefinition} />;
}
