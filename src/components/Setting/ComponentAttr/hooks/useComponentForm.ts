import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { normalizeChoiceModeFieldValue } from "../../../../materials/shared/choice";
import {
  normalizeMenuMode,
  normalizeMenuSelectedKeys,
  normalizeMenuTheme,
  normalizeMenuItems,
} from "../../../../materials/shared/menu";
import type { Component } from "../../../../stores/components";
import type { ComponentConfig } from "../../../../stores/component-config";
import { useComponentsStore } from "../../../../stores/components";
import { getNormalizedComponentValue } from "../utils/options";
import {
  normalizeBreadcrumbItems,
  normalizeDropdownMenuItems,
  normalizeEditableDescriptionsItems,
  normalizeEditableListDataSource,
  normalizeEditableMenuItems,
  normalizeEditableStepItems,
  normalizeEditableTableActions,
  normalizeEditableTableColumns,
  normalizeEditableTableDataSource,
  normalizeEditableTreeData,
  normalizeOptionItems,
  normalizeStepsCurrent,
  normalizeTabsActiveKey,
  normalizeTabsItems,
} from "../utils/normalize";

interface UseComponentFormParams {
  form: ReturnType<typeof Form.useForm>[0];
  curComponent: Component | null;
  curComponentId?: number | null;
  components: Component[];
  componentConfig: Record<string, ComponentConfig>;
  updateComponentProps: ReturnType<typeof useComponentsStore.getState>["updateComponentProps"];
}

function getFormValues(
  componentName: string,
  defaultProps: Record<string, unknown>,
  currentProps: Record<string, unknown>,
) {
  const formValues = {
    ...defaultProps,
    ...currentProps,
  };

  if (componentName === "Select") {
    return {
      ...formValues,
      mode: normalizeChoiceModeFieldValue(formValues.mode),
      value: getNormalizedComponentValue(componentName, formValues, {}),
    };
  }

  if (componentName === "Radio" || componentName === "Checkbox") {
    return {
      ...formValues,
      value: getNormalizedComponentValue(componentName, formValues, {}),
    };
  }

  if (componentName === "Steps") {
    const items = normalizeEditableStepItems(formValues.items);

    return {
      ...formValues,
      items,
      current: normalizeStepsCurrent(formValues.current, items),
    };
  }

  if (componentName === "Tabs") {
    const items = normalizeTabsItems(formValues.items);

    return {
      ...formValues,
      items,
      activeKey: normalizeTabsActiveKey(formValues.activeKey, items),
    };
  }

  if (componentName === "DatePicker") {
    const format = String(formValues.format ?? "YYYY-MM-DD");
    const rawValue = formValues.value;
    const dateValue =
      typeof rawValue === "string" && rawValue
        ? (() => {
            const parsedValue = dayjs(rawValue, format);
            if (parsedValue.isValid()) {
              return parsedValue;
            }

            const fallbackValue = dayjs(rawValue);
            return fallbackValue.isValid() ? fallbackValue : undefined;
          })()
        : undefined;

    return {
      ...formValues,
      value: dateValue,
    };
  }

  if (componentName === "Menu") {
    const items = normalizeEditableMenuItems(formValues.items);

    return {
      ...formValues,
      items,
      mode: normalizeMenuMode(formValues.mode),
      theme: normalizeMenuTheme(formValues.theme),
      selectedKeys: normalizeMenuSelectedKeys(
        formValues.selectedKeys,
        normalizeMenuItems(items),
      ),
    };
  }

  if (componentName === "Descriptions") {
    return {
      ...formValues,
      items: normalizeEditableDescriptionsItems(formValues.items),
    };
  }

  if (componentName === "List") {
    return {
      ...formValues,
      dataSource: normalizeEditableListDataSource(formValues.dataSource),
    };
  }

  if (componentName === "Table") {
    return {
      ...formValues,
      columns: normalizeEditableTableColumns(formValues.columns),
      dataSource: normalizeEditableTableDataSource(formValues.dataSource),
      actions: normalizeEditableTableActions(formValues.actions),
      actionsAlign:
        formValues.actionsAlign === "center" || formValues.actionsAlign === "right"
          ? formValues.actionsAlign
          : "left",
      pagination: formValues.pagination !== false,
      pageSize:
        Number.isInteger(Number(formValues.pageSize)) && Number(formValues.pageSize) > 0
          ? Number(formValues.pageSize)
          : 10,
      rowKey: String(formValues.rowKey ?? "key"),
    };
  }

  if (componentName === "Tree") {
    return {
      ...formValues,
      treeData: normalizeEditableTreeData(formValues.treeData),
    };
  }

  return formValues;
}

export function useComponentForm({
  form,
  curComponent,
  curComponentId,
  components,
  componentConfig,
  updateComponentProps,
}: UseComponentFormParams) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!curComponent) {
      return;
    }

    const config = componentConfig[curComponent.name];
    form.setFieldsValue(
      getFormValues(
        curComponent.name,
        (config?.defaultProps as Record<string, unknown>) ?? {},
        curComponent.props as Record<string, unknown>,
      ),
    );
  }, [curComponent, components, componentConfig, form]);

  function handleValuesChange(changeValues: Record<string, unknown>) {
    if (!curComponentId || !curComponent) {
      return;
    }

    const componentName = curComponent.name;
    const currentProps = curComponent.props as Record<string, unknown>;
    const normalizedChangeValues = { ...changeValues };

    if ("options" in normalizedChangeValues) {
      normalizedChangeValues.options = normalizeOptionItems(
        normalizedChangeValues.options,
      );
    }

    if (componentName === "Breadcrumb" && "items" in normalizedChangeValues) {
      normalizedChangeValues.items = normalizeBreadcrumbItems(
        normalizedChangeValues.items,
      );
    }

    if (componentName === "Steps") {
      if ("items" in normalizedChangeValues) {
        normalizedChangeValues.items = normalizeEditableStepItems(
          normalizedChangeValues.items,
        );
      }

      if ("items" in normalizedChangeValues || "current" in normalizedChangeValues) {
        const mergedItems = normalizeEditableStepItems(
          normalizedChangeValues.items ?? currentProps.items,
        );
        normalizedChangeValues.current = normalizeStepsCurrent(
          normalizedChangeValues.current ?? currentProps.current,
          mergedItems,
        );
      }
    }

    if (componentName === "Tabs") {
      if ("items" in normalizedChangeValues) {
        normalizedChangeValues.items = normalizeTabsItems(
          normalizedChangeValues.items,
        );
      }

      if ("items" in normalizedChangeValues || "activeKey" in normalizedChangeValues) {
        const mergedItems = normalizeTabsItems(
          normalizedChangeValues.items ?? currentProps.items,
        );
        normalizedChangeValues.activeKey = normalizeTabsActiveKey(
          normalizedChangeValues.activeKey ?? currentProps.activeKey,
          mergedItems,
        );
      }
    }

    if (componentName === "Dropdown" && "menu" in normalizedChangeValues) {
      normalizedChangeValues.menu = normalizeDropdownMenuItems(
        normalizedChangeValues.menu,
      );
    }

    if (componentName === "Menu") {
      if ("items" in normalizedChangeValues) {
        normalizedChangeValues.items = normalizeEditableMenuItems(
          normalizedChangeValues.items,
        );
      }

      if ("mode" in normalizedChangeValues) {
        normalizedChangeValues.mode = normalizeMenuMode(normalizedChangeValues.mode);
      }

      if ("theme" in normalizedChangeValues) {
        normalizedChangeValues.theme = normalizeMenuTheme(normalizedChangeValues.theme);
      }

      if ("items" in normalizedChangeValues || "selectedKeys" in normalizedChangeValues) {
        const mergedItems = normalizeMenuItems(
          normalizedChangeValues.items ?? currentProps.items,
        );
        normalizedChangeValues.selectedKeys = normalizeMenuSelectedKeys(
          normalizedChangeValues.selectedKeys ?? currentProps.selectedKeys,
          mergedItems,
        );
      }
    }

    if (componentName === "Descriptions" && "items" in normalizedChangeValues) {
      normalizedChangeValues.items = normalizeEditableDescriptionsItems(
        normalizedChangeValues.items,
      );
    }

    if (componentName === "List" && "dataSource" in normalizedChangeValues) {
      normalizedChangeValues.dataSource = normalizeEditableListDataSource(
        normalizedChangeValues.dataSource,
      );
    }

    if (componentName === "Table") {
      if ("columns" in normalizedChangeValues) {
        normalizedChangeValues.columns = normalizeEditableTableColumns(
          normalizedChangeValues.columns,
        );
      }

      if ("dataSource" in normalizedChangeValues) {
        normalizedChangeValues.dataSource = normalizeEditableTableDataSource(
          normalizedChangeValues.dataSource,
        );
      }

      if ("actions" in normalizedChangeValues) {
        normalizedChangeValues.actions = normalizeEditableTableActions(
          normalizedChangeValues.actions,
        );
      }

      if ("actionsAlign" in normalizedChangeValues) {
        normalizedChangeValues.actionsAlign =
          normalizedChangeValues.actionsAlign === "center" ||
          normalizedChangeValues.actionsAlign === "right"
            ? normalizedChangeValues.actionsAlign
            : "left";
      }

      if ("pagination" in normalizedChangeValues) {
        normalizedChangeValues.pagination =
          normalizedChangeValues.pagination !== false;
      }

      if ("pageSize" in normalizedChangeValues) {
        normalizedChangeValues.pageSize =
          Number.isInteger(Number(normalizedChangeValues.pageSize)) &&
          Number(normalizedChangeValues.pageSize) > 0
            ? Number(normalizedChangeValues.pageSize)
            : 10;
      }

      if ("rowKey" in normalizedChangeValues) {
        const previousRowKey = String(currentProps.rowKey ?? "key").trim() || "key";
        const nextRowKey =
          String(normalizedChangeValues.rowKey ?? "").trim() || "key";

        normalizedChangeValues.rowKey = nextRowKey;

        if (previousRowKey !== nextRowKey) {
          const mergedDataSource = normalizeEditableTableDataSource(
            normalizedChangeValues.dataSource ?? currentProps.dataSource,
          ).map((item, index) => {
            const nextItem = { ...item };
            const previousValue = nextItem[previousRowKey];
            const nextValue = nextItem[nextRowKey];

            if (
              (typeof nextValue !== "string" || !nextValue.trim()) &&
              typeof previousValue === "string" &&
              previousValue.trim()
            ) {
              nextItem[nextRowKey] = previousValue;
            }

            if (
              typeof nextItem[nextRowKey] !== "string" ||
              !String(nextItem[nextRowKey]).trim()
            ) {
              nextItem[nextRowKey] = `row-${index + 1}`;
            }
            return nextItem;
          });

          normalizedChangeValues.dataSource = mergedDataSource;
        }
      }
    }

    if (componentName === "Tree" && "treeData" in normalizedChangeValues) {
      normalizedChangeValues.treeData = normalizeEditableTreeData(
        normalizedChangeValues.treeData,
      );
    }

    if (componentName === "DatePicker" && "value" in normalizedChangeValues) {
      const mergedFormat = String(
        normalizedChangeValues.format ?? currentProps.format ?? "YYYY-MM-DD",
      );
      const nextValue = normalizedChangeValues.value;

      normalizedChangeValues.value =
        nextValue && dayjs.isDayjs(nextValue) && nextValue.isValid()
          ? nextValue.format(mergedFormat)
          : undefined;
    }

    if (componentName === "Select" && "mode" in normalizedChangeValues) {
      normalizedChangeValues.mode =
        normalizedChangeValues.mode === "multiple" ? "multiple" : undefined;
    }

    if (
      componentName === "Radio" ||
      componentName === "Checkbox" ||
      componentName === "Select"
    ) {
      normalizedChangeValues.value = getNormalizedComponentValue(
        componentName,
        currentProps,
        normalizedChangeValues,
      );
    }

    updateComponentProps(curComponentId, normalizedChangeValues);
    forceUpdate({});
  }

  return {
    handleValuesChange,
  };
}
