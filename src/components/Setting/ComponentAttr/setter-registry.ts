import type { SetterRenderer } from "./types";
import {
  BasicInputNumberSetter,
  BasicInputSetter,
  BasicSelectSetter,
  BasicSwitchSetter,
  BasicTextareaSetter,
  CheckboxSetter,
  DatePickerSetter,
  DateTimePickerSetter,
  FallbackInputSetter,
  ImageSetter,
  RadioSetter,
  ReadonlyJsonSetter,
  TimePickerSetter,
} from "./setters/basic";
import {
  BreadcrumbItemsSetter,
  DescriptionsItemsSetter,
  DropdownMenuItemsSetter,
  ListDataSourceSetter,
  OptionListSetter,
  StepsItemsSetter,
  TabsItemsSetter,
} from "./setters/collections/flat";
import { MenuItemsSetter, TreeDataSetter } from "./setters/collections/tree";
import {
  TableActionsSetter,
  TableColumnsSetter,
  TableDataSourceSetter,
} from "./setters/collections/table";

export const setterRegistry: Record<string, SetterRenderer> = {
  input: BasicInputSetter,
  select: BasicSelectSetter,
  switch: BasicSwitchSetter,
  inputNumber: BasicInputNumberSetter,
  textarea: BasicTextareaSetter,
  image: ImageSetter,
  readonlyJson: ReadonlyJsonSetter,
  optionList: OptionListSetter,
  breadcrumbItems: BreadcrumbItemsSetter,
  stepsItems: StepsItemsSetter,
  tabsItems: TabsItemsSetter,
  dropdownMenuItems: DropdownMenuItemsSetter,
  menuItems: MenuItemsSetter,
  descriptionsItems: DescriptionsItemsSetter,
  listDataSource: ListDataSourceSetter,
  tableColumns: TableColumnsSetter,
  tableDataSource: TableDataSourceSetter,
  tableActions: TableActionsSetter,
  treeData: TreeDataSetter,
  radio: RadioSetter,
  checkbox: CheckboxSetter,
  datePicker: DatePickerSetter,
  timePicker: TimePickerSetter,
  dateTimePicker: DateTimePickerSetter,
};

export { FallbackInputSetter };
