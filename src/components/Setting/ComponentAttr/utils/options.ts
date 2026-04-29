import {
  normalizeChoiceMode,
  normalizeChoiceValue,
  normalizeMultipleChoiceValue,
  normalizeSingleChoiceValue,
} from "../../../../materials/shared/choice";
import {
  flattenMenuSelectableItems,
  normalizeMenuItems,
} from "../../../../materials/shared/menu";
import {
  normalizeEditableStepItems,
  normalizeOptionItems,
  normalizeTabsItems,
} from "./normalize";

export function getCurrentOptionSelectOptions(
  currentProps: Record<string, unknown>,
) {
  return normalizeOptionItems(currentProps.options).map((item) => ({
    label: `${item.label} (${item.value})`,
    value: item.value,
  }));
}

export function getCurrentTabSelectOptions(currentProps: Record<string, unknown>) {
  return normalizeTabsItems(currentProps.items).map((item) => ({
    label: `${item.label} (${item.key})`,
    value: item.key,
  }));
}

export function getCurrentStepSelectOptions(
  currentProps: Record<string, unknown>,
) {
  return normalizeEditableStepItems(currentProps.items).map((item, index) => ({
    label: `${index + 1}. ${item.title || "未命名步骤"}`,
    value: index,
  }));
}

export function getCurrentMenuSelectOptions(
  currentProps: Record<string, unknown>,
) {
  return flattenMenuSelectableItems(normalizeMenuItems(currentProps.items));
}

export function getSelectMode(currentProps: Record<string, unknown>) {
  return normalizeChoiceMode(currentProps.mode);
}

export function getNormalizedComponentValue(
  componentName: string,
  currentProps: Record<string, unknown>,
  changeValues: Record<string, unknown>,
) {
  const mergedProps = {
    ...currentProps,
    ...changeValues,
  };
  const options = normalizeOptionItems(mergedProps.options);

  if (componentName === "Radio") {
    return normalizeSingleChoiceValue(mergedProps.value, options);
  }

  if (componentName === "Checkbox") {
    return normalizeMultipleChoiceValue(mergedProps.value, options);
  }

  if (componentName === "Select") {
    return normalizeChoiceValue(
      mergedProps.value,
      options,
      normalizeChoiceMode(mergedProps.mode),
    );
  }

  return mergedProps.value;
}
