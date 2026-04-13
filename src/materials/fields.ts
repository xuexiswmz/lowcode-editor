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
    createSetter("optionList", name, label, extra),
  breadcrumbItems: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("breadcrumbItems", name, label, extra),
  readonlyJson: (name: string, label: string, extra?: SetterExtra) =>
    createSetter("readonlyJson", name, label, extra),
};
