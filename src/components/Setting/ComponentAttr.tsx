import {
  Button,
  Form,
  Image as AntdImage,
  Input,
  Select,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  normalizeChoiceMode,
  normalizeChoiceModeFieldValue,
  normalizeChoiceOptions,
  normalizeChoiceValue,
  normalizeMultipleChoiceValue,
  normalizeSingleChoiceValue,
  type ChoiceOption,
} from "../../materials/shared/choice";
import {
  flattenMenuSelectableItems,
  normalizeMenuItems,
  normalizeMenuMode,
  normalizeMenuSelectedKeys,
  normalizeMenuTheme,
  type MenuItemConfig,
} from "../../materials/shared/menu";
import { useComponentsStore } from "../../stores/components";
import {
  useComponentConfigStore,
  type componentSetter,
} from "../../stores/component-config";

interface SetterInputProps<TValue> {
  value?: TValue;
  onChange?: (value: TValue) => void;
}

type OptionItem = ChoiceOption;
interface BreadcrumbItem {
  title: string;
  href?: string;
}
interface StepItem {
  title: string;
  description?: string;
}
interface TabsItem {
  key: string;
  label: string;
  children?: string;
  disabled?: boolean;
}
interface DropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
}
type EditableMenuItem = MenuItemConfig;
interface DescriptionItem {
  key: string;
  label: string;
  children: string;
  span?: number;
}
interface ListDataItem {
  key: string;
  title: string;
  description?: string;
  extra?: string;
}
interface TableColumnItem {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  align?: "left" | "center" | "right";
  ellipsis?: boolean;
  renderType?: "text" | "index" | "custom";
  template?: string;
}
interface TableActionItem {
  key: string;
  label: string;
  type?: "text" | "button";
  buttonType?: "default" | "primary" | "link";
  danger?: boolean;
  disabled?: boolean;
}
type TableDataRow = Record<string, unknown>;
function normalizeOptionItems(value: unknown): OptionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeChoiceOptions(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return normalizeChoiceOptions(value);
}

function normalizeBreadcrumbItems(value: unknown): BreadcrumbItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeBreadcrumbItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is BreadcrumbItem =>
        typeof item === "object" && item !== null && "title" in item,
    )
    .map((item) => ({
      title: String(item.title),
      href:
        typeof item.href === "string" && item.href.trim()
          ? item.href
          : undefined,
    }))
    .filter((item) => item.title.trim());
}

function normalizeEditableStepItems(value: unknown): StepItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableStepItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is StepItem =>
        typeof item === "object" && item !== null && "title" in item,
    )
    .map((item) => ({
      title: String(item.title ?? ""),
      description:
        typeof item.description === "string" ? item.description : undefined,
    }));
}

function normalizeTabsItems(value: unknown): TabsItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeTabsItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TabsItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => ({
      key: String(item.key),
      label: String(item.label),
      children:
        typeof item.children === "string" && item.children.trim()
          ? item.children
          : undefined,
      disabled: Boolean(item.disabled),
    }))
    .filter((item) => item.key.trim() && item.label.trim());
}

function normalizeDropdownMenuItems(value: unknown): DropdownMenuItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeDropdownMenuItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is DropdownMenuItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => ({
      key: String(item.key),
      label: String(item.label),
      disabled: Boolean(item.disabled),
    }))
    .filter((item) => item.key.trim() && item.label.trim());
}

function normalizeEditableDescriptionsItems(value: unknown): DescriptionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableDescriptionsItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is DescriptionItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item &&
        "children" in item,
    )
    .map((item) => ({
      key: String(item.key ?? ""),
      label: String(item.label ?? ""),
      children: String(item.children ?? ""),
      span:
        Number.isInteger(Number(item.span)) && Number(item.span) > 0
          ? Number(item.span)
          : 1,
    }));
}

function normalizeEditableMenuItems(value: unknown): EditableMenuItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableMenuItems(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is EditableMenuItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "label" in item,
    )
    .map((item) => ({
      key: String(item.key ?? ""),
      label: String(item.label ?? ""),
      disabled: Boolean(item.disabled),
      children: (() => {
        const nextChildren = normalizeEditableMenuItems(item.children);
        return nextChildren.length > 0 ? nextChildren : undefined;
      })(),
    }));
}

function normalizeEditableListDataSource(value: unknown): ListDataItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableListDataSource(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is ListDataItem =>
        typeof item === "object" &&
        item !== null &&
        "key" in item &&
        "title" in item,
    )
    .map((item) => ({
      key: String(item.key ?? ""),
      title: String(item.title ?? ""),
      description:
        typeof item.description === "string" ? item.description : undefined,
      extra: typeof item.extra === "string" ? item.extra : undefined,
    }));
}

function normalizeEditableTableColumns(value: unknown): TableColumnItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTableColumns(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TableColumnItem =>
        typeof item === "object" &&
        item !== null &&
        ("key" in item || "title" in item || "dataIndex" in item),
    )
    .map((item, index) => {
      const key = String(item.key ?? "").trim();
      const dataIndex = String(item.dataIndex ?? "").trim();
      const widthValue = Number(item.width);

      return {
        key: key || dataIndex || `column-${index + 1}`,
        title: String(item.title ?? ""),
        dataIndex,
        width:
          Number.isFinite(widthValue) && widthValue > 0 ? widthValue : undefined,
        align:
          item.align === "center" || item.align === "right" ? item.align : "left",
        ellipsis: item.ellipsis !== false,
        renderType:
          item.renderType === "index" || item.renderType === "custom"
            ? item.renderType
            : "text",
        template:
          typeof item.template === "string" ? item.template : undefined,
      };
    });
}

function normalizeEditableTableDataSource(value: unknown): TableDataRow[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTableDataSource(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is TableDataRow =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
}

function normalizeEditableTableActions(value: unknown): TableActionItem[] {
  if (typeof value === "string" && value.trim()) {
    try {
      return normalizeEditableTableActions(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is TableActionItem =>
        typeof item === "object" &&
        item !== null &&
        ("key" in item || "label" in item),
    )
    .map((item, index) => ({
      key: String(item.key ?? "").trim() || `action-${index + 1}`,
      label: String(item.label ?? ""),
      type: item.type === "button" ? "button" : "text",
      buttonType:
        item.buttonType === "primary" || item.buttonType === "link"
          ? item.buttonType
          : "default",
      danger: Boolean(item.danger),
      disabled: Boolean(item.disabled),
    }));
}

function normalizeStepsCurrent(current: unknown, items: StepItem[]) {
  const numericValue = Number(current);

  if (!Number.isInteger(numericValue) || numericValue < 0) {
    return 0;
  }

  if (items.length === 0) {
    return 0;
  }

  return Math.min(numericValue, items.length - 1);
}

function normalizeTabsActiveKey(activeKey: unknown, items: TabsItem[]) {
  const nextKey = String(activeKey ?? "");

  if (items.some((item) => item.key === nextKey)) {
    return nextKey;
  }

  return items[0]?.key;
}

function getCurrentOptionSelectOptions(currentProps: Record<string, unknown>) {
  return normalizeOptionItems(currentProps.options).map((item) => ({
    label: `${item.label} (${item.value})`,
    value: item.value,
  }));
}

function getCurrentTabSelectOptions(currentProps: Record<string, unknown>) {
  return normalizeTabsItems(currentProps.items).map((item) => ({
    label: `${item.label} (${item.key})`,
    value: item.key,
  }));
}

function getCurrentStepSelectOptions(currentProps: Record<string, unknown>) {
  return normalizeEditableStepItems(currentProps.items).map((item, index) => ({
    label: `${index + 1}. ${item.title || "未命名步骤"}`,
    value: index,
  }));
}

function getCurrentMenuSelectOptions(currentProps: Record<string, unknown>) {
  return flattenMenuSelectableItems(normalizeMenuItems(currentProps.items));
}

function getSelectMode(currentProps: Record<string, unknown>) {
  return normalizeChoiceMode(currentProps.mode);
}

function getNormalizedComponentValue(
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
      value: normalizeChoiceValue(
        formValues.value,
        normalizeOptionItems(formValues.options),
        normalizeChoiceMode(formValues.mode),
      ),
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

  return formValues;
}

function OptionsSetterInput({ value, onChange }: SetterInputProps<unknown>) {
  const normalizedValue = normalizeOptionItems(value);

  function updateAt(index: number, key: keyof OptionItem, nextValue: string) {
    const nextOptions = normalizedValue.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: nextValue } : item,
    );
    onChange?.(nextOptions);
  }

  function addOption() {
    onChange?.([
      ...normalizedValue,
      {
        label: `选项${normalizedValue.length + 1}`,
        value: `option${normalizedValue.length + 1}`,
      },
    ]);
  }

  function removeOption(index: number) {
    const nextOptions = normalizedValue.filter((_, itemIndex) => itemIndex !== index);
    onChange?.(nextOptions.length > 0 ? nextOptions : []);
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr 1fr auto",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="标签"
            value={item.label}
            onChange={(event) => updateAt(index, "label", event.target.value)}
          />
          <Input
            placeholder="值"
            value={item.value}
            onChange={(event) => updateAt(index, "value", event.target.value)}
          />
          <Button danger type="text" onClick={() => removeOption(index)}>
            删除
          </Button>
        </div>
      ))}
      <Button type="dashed" block onClick={addOption}>
        新增选项
      </Button>
    </div>
  );
}

function ImageSetterInput({
  value,
  onChange,
}: SetterInputProps<string | { src?: string }>) {
  const imageSrc =
    typeof value === "string"
      ? value
      : value && typeof value === "object" && "src" in value
        ? value.src || ""
        : "";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Input
        placeholder="https://example.com/cover.png"
        value={imageSrc}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {imageSrc ? (
        <AntdImage
          src={imageSrc}
          alt="preview"
          style={{
            width: "100%",
            maxHeight: 160,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ) : null}
    </div>
  );
}

function ReadonlyJsonSetterInput({ value }: SetterInputProps<unknown>) {
  return (
    <Input.TextArea
      value={JSON.stringify(value ?? [], null, 2)}
      autoSize={{ minRows: 4, maxRows: 10 }}
      readOnly
    />
  );
}

function BreadcrumbItemsSetterInput({ value, onChange }: SetterInputProps<unknown>) {
  const normalizedValue = normalizeBreadcrumbItems(value);

  function updateAt(index: number, key: keyof BreadcrumbItem, nextValue: string) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]: key === "href" && !nextValue.trim() ? undefined : nextValue,
          }
        : item,
    );
    onChange?.(nextItems);
  }

  function addItem() {
    onChange?.([
      ...normalizedValue,
      {
        title: `导航${normalizedValue.length + 1}`,
        href: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr 1fr auto",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="标题"
            value={item.title}
            onChange={(event) => updateAt(index, "title", event.target.value)}
          />
          <Input
            placeholder="链接(可选)"
            value={item.href ?? ""}
            onChange={(event) => updateAt(index, "href", event.target.value)}
          />
          <Button danger type="text" onClick={() => removeItem(index)}>
            删除
          </Button>
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增项目
      </Button>
    </div>
  );
}

function StepsItemsSetterInput({ value, onChange }: SetterInputProps<unknown>) {
  const normalizedValue = normalizeEditableStepItems(value);

  function updateAt(index: number, key: keyof StepItem, nextValue: string) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]:
              key === "description" && !nextValue.trim()
                ? undefined
                : nextValue,
          }
        : item,
    );
    onChange?.(nextItems);
  }

  function addItem() {
    onChange?.([
      ...normalizedValue,
      {
        title: `步骤${normalizedValue.length + 1}`,
        description: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>步骤 {index + 1}</span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="标题"
            value={item.title}
            onChange={(event) => updateAt(index, "title", event.target.value)}
          />
          <Input
            placeholder="描述(可选)"
            value={item.description ?? ""}
            onChange={(event) =>
              updateAt(index, "description", event.target.value)
            }
          />
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增步骤
      </Button>
    </div>
  );
}

function TabsItemsSetterInput({ value, onChange }: SetterInputProps<unknown>) {
  const normalizedValue = normalizeTabsItems(value);

  function updateAt(
    index: number,
    key: keyof TabsItem,
    nextValue: string | boolean,
  ) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]:
              key === "children" &&
              typeof nextValue === "string" &&
              !nextValue.trim()
                ? undefined
                : nextValue,
          }
        : item,
    );
    onChange?.(nextItems);
  }

  function addItem() {
    onChange?.([
      ...normalizedValue,
      {
        key: `tab${normalizedValue.length + 1}`,
        label: `标签${normalizedValue.length + 1}`,
        children: `标签${normalizedValue.length + 1}内容`,
        disabled: false,
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              面板 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="key"
            value={item.key}
            onChange={(event) => updateAt(index, "key", event.target.value)}
          />
          <Input
            placeholder="标题"
            value={item.label}
            onChange={(event) => updateAt(index, "label", event.target.value)}
          />
          <Input.TextArea
            placeholder="内容"
            value={item.children ?? ""}
            autoSize={{ minRows: 2, maxRows: 4 }}
            onChange={(event) => updateAt(index, "children", event.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>禁用</span>
            <Switch
              checked={item.disabled}
              onChange={(checked) => updateAt(index, "disabled", checked)}
            />
          </div>
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增面板
      </Button>
    </div>
  );
}

function DropdownMenuItemsSetterInput({
  value,
  onChange,
}: SetterInputProps<unknown>) {
  const normalizedValue = normalizeDropdownMenuItems(value);

  function updateAt(
    index: number,
    key: keyof DropdownMenuItem,
    nextValue: string | boolean,
  ) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]: nextValue,
          }
        : item,
    );
    onChange?.(nextItems);
  }

  function addItem() {
    onChange?.([
      ...normalizedValue,
      {
        key: `menu${normalizedValue.length + 1}`,
        label: `菜单${normalizedValue.length + 1}`,
        disabled: false,
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              菜单项 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="key"
            value={item.key}
            onChange={(event) => updateAt(index, "key", event.target.value)}
          />
          <Input
            placeholder="标题"
            value={item.label}
            onChange={(event) => updateAt(index, "label", event.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>禁用</span>
            <Switch
              checked={item.disabled}
              onChange={(checked) => updateAt(index, "disabled", checked)}
            />
          </div>
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增菜单项
      </Button>
    </div>
  );
}

function MenuItemsSetterInput({ value, onChange }: SetterInputProps<unknown>) {
  const normalizedValue = normalizeEditableMenuItems(value);

  function updateItems(nextItems: EditableMenuItem[]) {
    onChange?.(nextItems);
  }

  function updateItemAtPath(
    items: EditableMenuItem[],
    path: number[],
    updater: (item: EditableMenuItem) => EditableMenuItem,
  ): EditableMenuItem[] {
    return items.map((item, index) => {
      if (index !== path[0]) {
        return item;
      }

      if (path.length === 1) {
        return updater(item);
      }

      return {
        ...item,
        children: updateItemAtPath(item.children ?? [], path.slice(1), updater),
      };
    });
  }

  function removeItemAtPath(items: EditableMenuItem[], path: number[]): EditableMenuItem[] {
    return items.flatMap((item, index) => {
      if (index !== path[0]) {
        return [item];
      }

      if (path.length === 1) {
        return [];
      }

      const nextChildren = removeItemAtPath(item.children ?? [], path.slice(1));
      return [
        {
          ...item,
          children: nextChildren.length > 0 ? nextChildren : undefined,
        },
      ];
    });
  }

  function createMenuItem(seed: number): EditableMenuItem {
    return {
      key: `menu-${seed}`,
      label: `菜单${seed}`,
      disabled: false,
    };
  }

  function addRootItem() {
    updateItems([...normalizedValue, createMenuItem(normalizedValue.length + 1)]);
  }

  function addSibling(path: number[]) {
    function insertAtPath(items: EditableMenuItem[], currentPath: number[]): EditableMenuItem[] {
      if (currentPath.length === 1) {
        const insertIndex = currentPath[0] + 1;
        const nextItems = [...items];
        nextItems.splice(insertIndex, 0, createMenuItem(Date.now()));
        return nextItems;
      }

      return items.map((item, index) =>
        index === currentPath[0]
          ? {
              ...item,
              children: insertAtPath(item.children ?? [], currentPath.slice(1)),
            }
          : item,
      );
    }

    updateItems(insertAtPath(normalizedValue, path));
  }

  function addChild(path: number[]) {
    updateItems(
      updateItemAtPath(normalizedValue, path, (item) => ({
        ...item,
        children: [
          ...(item.children ?? []),
          createMenuItem(Date.now()),
        ],
      })),
    );
  }

  function updateField(
    path: number[],
    key: keyof EditableMenuItem,
    nextValue: string | boolean,
  ) {
    updateItems(
      updateItemAtPath(normalizedValue, path, (item) => ({
        ...item,
        [key]: nextValue,
      })),
    );
  }

  function removeItem(path: number[]) {
    updateItems(removeItemAtPath(normalizedValue, path));
  }

  function renderItems(items: EditableMenuItem[], parentPath: number[] = [], depth = 0) {
    return items.map((item, index) => {
      const path = [...parentPath, index];
      const pathKey = path.join("-");

      return (
        <div
          key={pathKey}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              菜单项 {path.map((itemIndex) => itemIndex + 1).join(".")}
            </span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Button size="small" type="text" onClick={() => addSibling(path)}>
                新增同级
              </Button>
              <Button size="small" type="text" onClick={() => addChild(path)}>
                新增子级
              </Button>
              <Button danger size="small" type="text" onClick={() => removeItem(path)}>
                删除
              </Button>
            </div>
          </div>
          <Input
            placeholder="key"
            value={item.key}
            onChange={(event) => updateField(path, "key", event.target.value)}
          />
          <Input
            placeholder="标题"
            value={item.label}
            onChange={(event) => updateField(path, "label", event.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>禁用</span>
            <Switch
              checked={item.disabled}
              onChange={(checked) => updateField(path, "disabled", checked)}
            />
          </div>
          {item.children && item.children.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: 8,
                minWidth: 0,
                paddingLeft: 12,
                marginLeft: 4,
                borderLeft: "2px solid #f0f0f0",
              }}
            >
              {renderItems(item.children, path, depth + 1)}
            </div>
          ) : null}
        </div>
      );
    });
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {renderItems(normalizedValue)}
      <Button type="dashed" block onClick={addRootItem}>
        新增菜单项
      </Button>
    </div>
  );
}

function DescriptionsItemsSetterInput({
  value,
  onChange,
}: SetterInputProps<unknown>) {
  const normalizedValue = normalizeEditableDescriptionsItems(value);

  function updateAt(
    index: number,
    key: keyof DescriptionItem,
    nextValue: string | number,
  ) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]: nextValue,
          }
        : item,
    );
    onChange?.(nextItems);
  }

  function addItem() {
    onChange?.([
      ...normalizedValue,
      {
        key: `field${normalizedValue.length + 1}`,
        label: `字段${normalizedValue.length + 1}`,
        children: `值${normalizedValue.length + 1}`,
        span: 1,
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              键值项 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="key"
            value={item.key}
            onChange={(event) => updateAt(index, "key", event.target.value)}
          />
          <Input
            placeholder="字段名"
            value={item.label}
            onChange={(event) => updateAt(index, "label", event.target.value)}
          />
          <Input.TextArea
            placeholder="字段值"
            value={item.children}
            autoSize={{ minRows: 2, maxRows: 4 }}
            onChange={(event) => updateAt(index, "children", event.target.value)}
          />
          <InputNumber
            placeholder="占列数"
            min={1}
            style={{ width: "100%" }}
            value={item.span ?? 1}
            onChange={(value) => updateAt(index, "span", Number(value) || 1)}
          />
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增键值项
      </Button>
    </div>
  );
}

function ListDataSourceSetterInput({
  value,
  onChange,
}: SetterInputProps<unknown>) {
  const normalizedValue = normalizeEditableListDataSource(value);

  function updateAt(
    index: number,
    key: keyof ListDataItem,
    nextValue: string,
  ) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]: nextValue,
          }
        : item,
    );
    onChange?.(nextItems);
  }

  function addItem() {
    onChange?.([
      ...normalizedValue,
      {
        key: `list-${normalizedValue.length + 1}`,
        title: `列表项${normalizedValue.length + 1}`,
        description: `这里是列表项${normalizedValue.length + 1}的描述信息`,
        extra: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              数据项 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="key"
            value={item.key}
            onChange={(event) => updateAt(index, "key", event.target.value)}
          />
          <Input
            placeholder="标题"
            value={item.title}
            onChange={(event) => updateAt(index, "title", event.target.value)}
          />
          <Input.TextArea
            placeholder="描述"
            value={item.description ?? ""}
            autoSize={{ minRows: 2, maxRows: 4 }}
            onChange={(event) => updateAt(index, "description", event.target.value)}
          />
          <Input
            placeholder="右侧内容(可选)"
            value={item.extra ?? ""}
            onChange={(event) => updateAt(index, "extra", event.target.value)}
          />
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增数据项
      </Button>
    </div>
  );
}

function TableColumnsSetterInput({
  value,
  onChange,
}: SetterInputProps<unknown>) {
  const normalizedValue = normalizeEditableTableColumns(value);

  function updateAt(
    index: number,
    key: keyof TableColumnItem,
    nextValue: string | number | boolean | undefined,
  ) {
    onChange?.(
      normalizedValue.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: nextValue,
            }
          : item,
      ),
    );
  }

  function addColumn() {
    const nextIndex = normalizedValue.length + 1;
    onChange?.([
      ...normalizedValue,
      {
        key: `column-${nextIndex}`,
        title: `列${nextIndex}`,
        dataIndex: `field${nextIndex}`,
        width: 160,
        align: "left",
        ellipsis: true,
        renderType: "text",
        template: "",
      },
    ]);
  }

  function removeColumn(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              列 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeColumn(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="列 key"
            value={item.key}
            onChange={(event) => updateAt(index, "key", event.target.value)}
          />
          <Input
            placeholder="列标题"
            value={item.title}
            onChange={(event) => updateAt(index, "title", event.target.value)}
          />
          <Input
            placeholder="字段名 dataIndex"
            value={item.dataIndex}
            onChange={(event) => updateAt(index, "dataIndex", event.target.value)}
            disabled={item.renderType === "index"}
          />
          <InputNumber
            placeholder="列宽"
            min={80}
            style={{ width: "100%" }}
            value={item.width}
            onChange={(nextValue) =>
              updateAt(
                index,
                "width",
                typeof nextValue === "number" ? nextValue : undefined,
              )
            }
          />
          <Select
            value={item.renderType ?? "text"}
            options={[
              { label: "普通文本", value: "text" },
              { label: "序号列", value: "index" },
              { label: "模板列", value: "custom" },
            ]}
            onChange={(nextValue) => {
              const nextRenderType = String(nextValue) as TableColumnItem["renderType"];

              onChange?.(
                normalizedValue.map((column, columnIndex) =>
                  columnIndex === index
                    ? {
                        ...column,
                        renderType: nextRenderType,
                        dataIndex:
                          nextRenderType === "index"
                            ? "__index__"
                            : column.dataIndex === "__index__"
                              ? `field${index + 1}`
                              : column.dataIndex,
                        template:
                          nextRenderType === "custom"
                            ? column.template || "{{name}}"
                            : "",
                      }
                    : column,
                ),
              );
            }}
          />
          <Select
            value={item.align ?? "left"}
            options={[
              { label: "左对齐", value: "left" },
              { label: "居中", value: "center" },
              { label: "右对齐", value: "right" },
            ]}
            onChange={(nextValue) => updateAt(index, "align", nextValue)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>超出省略</span>
            <Switch
              checked={item.ellipsis !== false}
              onChange={(checked) => updateAt(index, "ellipsis", checked)}
            />
          </div>
          {item.renderType === "custom" ? (
            <Input.TextArea
              placeholder="模板列内容，例如：{{name}} / {{status}}"
              value={item.template ?? ""}
              autoSize={{ minRows: 2, maxRows: 4 }}
              onChange={(event) => updateAt(index, "template", event.target.value)}
            />
          ) : null}
        </div>
      ))}
      <Button type="dashed" block onClick={addColumn}>
        新增列
      </Button>
    </div>
  );
}

function TableDataSourceSetterInput({
  value,
  onChange,
  columns,
  rowKey,
}: SetterInputProps<unknown> & {
  columns?: unknown;
  rowKey?: string;
}) {
  const normalizedValue = normalizeEditableTableDataSource(value);
  const normalizedColumns = normalizeEditableTableColumns(columns).filter(
    (item) => item.dataIndex.trim() || item.key.trim(),
  );
  const resolvedRowKey = String(rowKey ?? "").trim() || "key";

  function updateRowAt(index: number, key: string, nextValue: string) {
    onChange?.(
      normalizedValue.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: nextValue,
            }
          : item,
      ),
    );
  }

  function addRow() {
    const nextIndex = normalizedValue.length + 1;
    const nextRow = normalizedColumns.reduce<TableDataRow>(
      (acc, item) => {
        const fieldName = item.dataIndex.trim() || item.key;
        acc[fieldName] = `${item.title || fieldName}${nextIndex}`;
        return acc;
      },
      {
        [resolvedRowKey]: `row-${nextIndex}`,
      },
    );

    onChange?.([...normalizedValue, nextRow]);
  }

  function removeRow(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  if (normalizedColumns.length === 0) {
    return (
      <div
        style={{
          padding: 12,
          borderRadius: 8,
          border: "1px dashed #d9d9d9",
          background: "#fafafa",
          color: "#999",
          fontSize: 12,
        }}
      >
        请先配置列信息，再编辑数据源
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        style={{
          padding: 10,
          borderRadius: 8,
          background: "#fafafa",
          border: "1px solid #f0f0f0",
          color: "#666",
          fontSize: 12,
        }}
      >
        当前行主键字段：{resolvedRowKey}
      </div>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              行 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeRow(index)}>
              删除
            </Button>
          </div>
          {normalizedColumns.map((column) => {
            const fieldName = column.dataIndex.trim() || column.key;

            if (fieldName === resolvedRowKey || column.renderType === "index") {
              return null;
            }

            return (
              <Input
                key={`${index}-${fieldName}`}
                placeholder={column.title || fieldName}
                value={String(item[fieldName] ?? "")}
                onChange={(event) =>
                  updateRowAt(index, fieldName, event.target.value)
                }
              />
            );
          })}
        </div>
      ))}
      <Button type="dashed" block onClick={addRow}>
        新增行
      </Button>
    </div>
  );
}

function TableActionsSetterInput({
  value,
  onChange,
}: SetterInputProps<unknown>) {
  const normalizedValue = normalizeEditableTableActions(value);

  function updateAt(
    index: number,
    key: keyof TableActionItem,
    nextValue: string | boolean,
  ) {
    onChange?.(
      normalizedValue.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: nextValue,
            }
          : item,
      ),
    );
  }

  function addItem() {
    const nextIndex = normalizedValue.length + 1;
    onChange?.([
      ...normalizedValue,
      {
        key: `action-${nextIndex}`,
        label: `操作${nextIndex}`,
        type: "text",
        buttonType: "default",
        danger: false,
        disabled: false,
      },
    ]);
  }

  function removeItem(index: number) {
    onChange?.(normalizedValue.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {normalizedValue.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gap: 10,
            padding: 10,
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              操作项 {index + 1}
            </span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          <Input
            placeholder="操作 key"
            value={item.key}
            onChange={(event) => updateAt(index, "key", event.target.value)}
          />
          <Input
            placeholder="显示文字"
            value={item.label}
            onChange={(event) => updateAt(index, "label", event.target.value)}
          />
          <Select
            value={item.type ?? "text"}
            options={[
              { label: "文字", value: "text" },
              { label: "按钮", value: "button" },
            ]}
            onChange={(nextValue) => updateAt(index, "type", String(nextValue))}
          />
          {item.type === "button" ? (
            <Select
              value={item.buttonType ?? "default"}
              options={[
                { label: "默认按钮", value: "default" },
                { label: "主按钮", value: "primary" },
                { label: "链接按钮", value: "link" },
              ]}
              onChange={(nextValue) =>
                updateAt(index, "buttonType", String(nextValue))
              }
            />
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>危险态</span>
            <Switch
              checked={item.danger === true}
              onChange={(checked) => updateAt(index, "danger", checked)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>禁用</span>
            <Switch
              checked={item.disabled === true}
              onChange={(checked) => updateAt(index, "disabled", checked)}
            />
          </div>
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增操作项
      </Button>
    </div>
  );
}

export default function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponentId, curComponent, updateComponentProps, components } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  // 添加一个状态来强制更新组件
  const [, setForceUpdate] = useState({});

  // 当当前组件或组件列表变化时更新表单
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

  if (!curComponentId || !curComponent) {
    return null;
  }

  // 渲染表单元素
  function renderFormElement(
    setting: componentSetter,
    componentName: string,
    currentProps: Record<string, unknown>
  ) {
    const { type, options, name } = setting;

    // 获取当前组件的配置
    const config = componentConfig[componentName];

    // 获取最大长度限制，优先使用组件当前的props中的maxLength
    let maxLength: number | undefined;
    if ((componentName === "Input" || componentName === "Textarea") && name === "value") {
      // 对于Input组件的value字段，使用当前组件的maxLength属性
      maxLength = currentProps.maxLength as number | undefined;
      // 如果没有设置，则使用默认值
      if (maxLength === undefined) {
        maxLength = config?.defaultProps?.maxLength as number | undefined;
      }
    }

    if (type === "select") {
      if (componentName === "Radio" && name === "value") {
        return (
          <Select
            options={getCurrentOptionSelectOptions(currentProps)}
            placeholder="请先配置选项"
            allowClear
          />
        );
      }

      if (componentName === "Checkbox" && name === "value") {
        return (
          <Select
            mode="multiple"
            options={getCurrentOptionSelectOptions(currentProps)}
            placeholder="请先配置选项"
          />
        );
      }

      if (componentName === "Select" && name === "value") {
        return (
          <Select
            mode={getSelectMode(currentProps)}
            options={getCurrentOptionSelectOptions(currentProps)}
            placeholder="请先配置选项"
            allowClear
          />
        );
      }

      if (componentName === "Tabs" && name === "activeKey") {
        return (
          <Select
            options={getCurrentTabSelectOptions(currentProps)}
            placeholder="请先配置面板"
            allowClear
          />
        );
      }

      if (componentName === "Menu" && name === "selectedKeys") {
        return (
          <Select
            mode="multiple"
            options={getCurrentMenuSelectOptions(currentProps)}
            placeholder="请先配置可选菜单项"
          />
        );
      }

      if (componentName === "Select" && name === "mode") {
        return (
          <Select
            options={[
              { label: "单选", value: "single" },
              { label: "多选", value: "multiple" },
            ]}
          />
        );
      }

      return <Select options={options} />;
    }

    if (type === "input") {
      if (componentName === "Textarea" && name === "value") {
        const rows =
          (currentProps.rows as number | undefined) ??
          (config?.defaultProps?.rows as number | undefined) ??
          4;
        return <Input.TextArea maxLength={maxLength} rows={rows} />;
      }

      if (name === "value" && maxLength !== undefined) {
        return <Input maxLength={maxLength} />;
      }

      return <Input />;
    }

    if (type === "image") {
      return <ImageSetterInput />;
    }

    if (type === "switch") {
      return <Switch />;
    }

    if (type === "inputNumber") {
      if (componentName === "Steps" && name === "current") {
        return (
          <Select
            options={getCurrentStepSelectOptions(currentProps)}
            placeholder="请先配置步骤项"
          />
        );
      }

      return <InputNumber style={{ width: "100%" }} />;
    }

    if (type === "textarea") {
      return <Input.TextArea />;
    }

    if (type === "readonlyJson") {
      return <ReadonlyJsonSetterInput />;
    }

    if (type === "breadcrumbItems") {
      return <BreadcrumbItemsSetterInput />;
    }

    if (type === "stepsItems") {
      return <StepsItemsSetterInput />;
    }

    if (type === "tabsItems") {
      return <TabsItemsSetterInput />;
    }

    if (type === "dropdownMenuItems") {
      return <DropdownMenuItemsSetterInput />;
    }

    if (type === "menuItems") {
      return <MenuItemsSetterInput />;
    }

    if (type === "descriptionsItems") {
      return <DescriptionsItemsSetterInput />;
    }

    if (type === "listDataSource") {
      return <ListDataSourceSetterInput />;
    }

    if (type === "tableColumns") {
      return <TableColumnsSetterInput />;
    }

    if (type === "tableDataSource") {
      return (
        <TableDataSourceSetterInput
          columns={currentProps.columns}
          rowKey={String(currentProps.rowKey ?? "key")}
        />
      );
    }

    if (type === "tableActions") {
      return <TableActionsSetterInput />;
    }

    if (type === "optionList") {
      return <OptionsSetterInput />;
    }

    if (type === "radio") {
      return <Radio.Group />;
    }

    if (type === "checkbox") {
      return <Checkbox.Group />;
    }

    if (type === "datePicker") {
      return <DatePicker />;
    }

    if (type === "timePicker") {
      return <TimePicker />;
    }

    if (type === "dateTimePicker") {
      return <DatePicker showTime />;
    }

    return <Input />;
  }

  function valueChange(changeValues: Record<string, unknown>) {
    if (!curComponentId) {
      return;
    }

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
        currentProps as Record<string, unknown>,
        normalizedChangeValues,
      );
    }

    updateComponentProps(curComponentId, normalizedChangeValues);
      // 强制更新组件以反映最新的props
    setForceUpdate({});
    
  }

  // 获取组件名称和当前属性
  const componentName = curComponent.name;
  const currentProps = curComponent.props;

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={componentName} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[componentName]?.setter?.map((setter) => (
        <Form.Item
          key={setter.name}
          label={setter.label}
          name={setter.name}
          valuePropName={setter.type === "switch" ? "checked" : "value"}
        >
          {renderFormElement(setter, componentName, currentProps)}
        </Form.Item>
      ))}
    </Form>
  );
}
