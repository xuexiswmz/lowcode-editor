import { Button, Input } from "antd";
import type { SetterRendererProps, TableDataRow } from "../../../types";
import {
  appendItem,
  removeItemAtIndex,
  updateItemAtIndex,
} from "../flat/collection-ops";
import {
  normalizeEditableTableColumns,
  normalizeEditableTableDataSource,
} from "../../../utils/normalize";

export function TableDataSourceSetter({
  value,
  onChange,
  currentProps,
}: SetterRendererProps<unknown>) {
  const dataSource = normalizeEditableTableDataSource(value);
  const columns = normalizeEditableTableColumns(currentProps.columns).filter(
    (item) => item.dataIndex.trim() || item.key.trim(),
  );
  const resolvedRowKey = String(currentProps.rowKey ?? "").trim() || "key";

  function updateRowAt(index: number, key: string, nextValue: string) {
    onChange?.(
      updateItemAtIndex(dataSource, index, (item) => ({
        ...item,
        [key]: nextValue,
      })),
    );
  }

  function addRow() {
    const nextIndex = dataSource.length + 1;
    const nextRow = columns.reduce<TableDataRow>(
      (acc, item) => {
        const fieldName = item.dataIndex.trim() || item.key;
        acc[fieldName] = `${item.title || fieldName}${nextIndex}`;
        return acc;
      },
      {
        [resolvedRowKey]: `row-${nextIndex}`,
      },
    );

    onChange?.(appendItem(dataSource, nextRow));
  }

  function removeRow(index: number) {
    onChange?.(removeItemAtIndex(dataSource, index));
  }

  if (columns.length === 0) {
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
      {dataSource.map((item, index) => (
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
            <span style={{ color: "#666", fontSize: 12 }}>行 {index + 1}</span>
            <Button danger size="small" type="text" onClick={() => removeRow(index)}>
              删除
            </Button>
          </div>
          {columns.map((column) => {
            const fieldName = column.dataIndex.trim() || column.key;

            if (fieldName === resolvedRowKey || column.renderType === "index") {
              return null;
            }

            return (
              <Input
                key={`${index}-${fieldName}`}
                placeholder={column.title || fieldName}
                value={String(item[fieldName] ?? "")}
                onChange={(event) => updateRowAt(index, fieldName, event.target.value)}
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
