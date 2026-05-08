import { Button, Input, InputNumber, Select, Switch } from "antd";
import type { SetterRendererProps } from "../../../types";
import {
  appendItem,
  removeItemAtIndex,
  updateItemAtIndex,
} from "./collection-ops";
import type { FlatCollectionDefinition, FlatCollectionField } from "./types";

function normalizeFieldValue<TItem>(
  field: FlatCollectionField<TItem>,
  value: unknown,
  item: TItem,
) {
  return field.normalize ? field.normalize(value, item) : value;
}

function renderField<TItem extends object>(
  field: FlatCollectionField<TItem>,
  item: TItem,
  onChange: (value: unknown) => void,
) {
  if (field.type === "textarea") {
    return (
      <Input.TextArea
        placeholder={field.placeholder}
        value={String(item[field.key] ?? "")}
        onChange={(event) => onChange(event.target.value)}
        {...field.props}
      />
    );
  }

  if (field.type === "switch") {
    return (
      <Switch
        checked={Boolean(item[field.key])}
        onChange={(checked) => onChange(checked)}
        {...field.props}
      />
    );
  }

  if (field.type === "inputNumber") {
    const value = item[field.key];
    return (
      <InputNumber
        min={field.min}
        style={{ width: "100%" }}
        value={typeof value === "number" ? value : Number(value)}
        onChange={(nextValue) => onChange(nextValue)}
        {...field.props}
      />
    );
  }

  if (field.type === "select") {
    return (
      <Select
        options={field.options}
        value={item[field.key] as string | undefined}
        onChange={(nextValue) => onChange(nextValue)}
        {...field.props}
      />
    );
  }

  return (
    <Input
      placeholder={field.placeholder}
      value={String(item[field.key] ?? "")}
      onChange={(event) => onChange(event.target.value)}
      {...field.props}
    />
  );
}

export function FlatCollectionSetter<TItem extends object>({
  value,
  onChange,
  definition,
}: SetterRendererProps<unknown> & {
  definition: FlatCollectionDefinition<TItem>;
}) {
  const items = definition.normalize(value);

  function updateField(
    index: number,
    field: FlatCollectionField<TItem>,
    nextValue: unknown,
  ) {
    onChange?.(
      updateItemAtIndex(items, index, (item) => ({
        ...item,
        [field.key]: normalizeFieldValue(field, nextValue, item),
      })),
    );
  }

  function addItem() {
    onChange?.(appendItem(items, definition.createItem(items)));
  }

  function removeItem(index: number) {
    onChange?.(removeItemAtIndex(items, index));
  }

  if (definition.layout === "row") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: `repeat(${definition.fields.length}, minmax(0, 1fr)) auto`,
              alignItems: "center",
            }}
          >
            {definition.fields.map((field) =>
              renderField(field, item, (nextValue) =>
                updateField(index, field, nextValue),
              ),
            )}
            <Button danger type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
        ))}
        <Button type="dashed" block onClick={addItem}>
          {definition.addLabel}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((item, index) => (
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
              {definition.getItemTitle(item, index)}
            </span>
            <Button danger size="small" type="text" onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
          {definition.fields.map((field) =>
            renderField(field, item, (nextValue) =>
              updateField(index, field, nextValue),
            ),
          )}
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        {definition.addLabel}
      </Button>
    </div>
  );
}
