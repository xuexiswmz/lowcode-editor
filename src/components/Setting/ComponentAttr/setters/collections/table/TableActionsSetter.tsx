import { Button, Input, Select, Switch } from "antd";
import type { SetterRendererProps, TableActionItem } from "../../../types";
import {
  appendItem,
  removeItemAtIndex,
  updateItemAtIndex,
} from "../flat/collection-ops";
import { normalizeEditableTableActions } from "../../../utils/normalize";

export function TableActionsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const actions = normalizeEditableTableActions(value);

  function updateAt(
    index: number,
    key: keyof TableActionItem,
    nextValue: string | boolean,
  ) {
    onChange?.(
      updateItemAtIndex(actions, index, (item) => ({
        ...item,
        [key]: nextValue,
      })),
    );
  }

  function addItem() {
    const nextIndex = actions.length + 1;
    onChange?.(
      appendItem(actions, {
        key: `action-${nextIndex}`,
        label: `操作${nextIndex}`,
        type: "text",
        buttonType: "default",
        danger: false,
        disabled: false,
      }),
    );
  }

  function removeItem(index: number) {
    onChange?.(removeItemAtIndex(actions, index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {actions.map((item, index) => (
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
            <span style={{ color: "#666", fontSize: 12 }}>操作项 {index + 1}</span>
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
