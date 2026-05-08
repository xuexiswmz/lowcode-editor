import type { ComponentSetter } from "./types";

type SetterExtra = Omit<ComponentSetter, "name" | "label" | "type" | "options">;

function createSetter(
  type: ComponentSetter["type"],
  name: string,
  label: string,
  extra?: SetterExtra,
): ComponentSetter {
  return {
    name,
    label,
    type,
    ...extra,
  };
}

export const field = {
  input: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("input", name, label, extra),
  inputNumber: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("inputNumber", name, label, extra),
  select: (
    name: string,
    label: string,
    options: NonNullable<ComponentSetter["options"]>,
    extra?: SetterExtra,
  ) =>
    createSetter("select", name, label, {
      options,
      ...extra,
    }),
  switch: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("switch", name, label, extra),
  image: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("image", name, label, extra),
  datePicker: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("datePicker", name, label, extra),
  textarea: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("textarea", name, label, extra),
  optionList: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("optionList", name, label, {
      collection: { kind: "flat", definition: "optionList" },
      ...extra,
    }),
  breadcrumbItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("breadcrumbItems", name, label, {
      collection: { kind: "flat", definition: "breadcrumbItems" },
      ...extra,
    }),
  stepsItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("stepsItems", name, label, {
      collection: { kind: "flat", definition: "stepsItems" },
      ...extra,
    }),
  tabsItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("tabsItems", name, label, {
      collection: { kind: "flat", definition: "tabsItems" },
      ...extra,
    }),
  dropdownMenuItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("dropdownMenuItems", name, label, {
      collection: { kind: "flat", definition: "dropdownMenuItems" },
      ...extra,
    }),
  menuItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("menuItems", name, label, {
      collection: { kind: "tree", definition: "menuItems" },
      ...extra,
    }),
  descriptionsItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("descriptionsItems", name, label, {
      collection: { kind: "flat", definition: "descriptionsItems" },
      ...extra,
    }),
  listDataSource: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("listDataSource", name, label, {
      collection: { kind: "flat", definition: "listDataSource" },
      ...extra,
    }),
  tableColumns: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("tableColumns", name, label, {
      collection: { kind: "table", definition: "tableColumns" },
      ...extra,
    }),
  tableDataSource: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("tableDataSource", name, label, {
      collection: { kind: "table", definition: "tableDataSource" },
      ...extra,
    }),
  tableActions: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("tableActions", name, label, {
      collection: { kind: "table", definition: "tableActions" },
      ...extra,
    }),
  treeData: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("treeData", name, label, {
      collection: { kind: "tree", definition: "treeData" },
      ...extra,
    }),
  readonlyJson: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("readonlyJson", name, label, extra),
};
