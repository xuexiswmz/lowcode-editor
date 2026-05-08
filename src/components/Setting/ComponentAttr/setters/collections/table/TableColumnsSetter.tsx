import { Button, Input, InputNumber, Select, Switch } from "antd";
import type { SetterRendererProps, TableColumnItem } from "../../../types";
import {
  appendItem,
  removeItemAtIndex,
  updateItemAtIndex,
} from "../flat/collection-ops";
import { normalizeEditableTableColumns } from "../../../utils/normalize";

export function TableColumnsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const columns = normalizeEditableTableColumns(value);

  function updateAt(
    index: number,
    key: keyof TableColumnItem,
    nextValue: string | number | boolean | undefined,
  ) {
    onChange?.(
      updateItemAtIndex(columns, index, (item) => ({
        ...item,
        [key]: nextValue,
      })),
    );
  }

  function addColumn() {
    const nextIndex = columns.length + 1;
    onChange?.(
      appendItem(columns, {
        key: `column-${nextIndex}`,
        title: `列${nextIndex}`,
        dataIndex: `field${nextIndex}`,
        width: 160,
        align: "left",
        ellipsis: true,
        renderType: "text",
        template: "",
      }),
    );
  }

  function removeColumn(index: number) {
    onChange?.(removeItemAtIndex(columns, index));
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {columns.map((item, index) => (
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
            <span style={{ color: "#666", fontSize: 12 }}>列 {index + 1}</span>
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
              const nextRenderType = String(
                nextValue,
              ) as TableColumnItem["renderType"];

              onChange?.(
                updateItemAtIndex(columns, index, (column) => ({
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
                })),
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
