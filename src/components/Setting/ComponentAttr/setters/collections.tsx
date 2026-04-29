import { Button, Input, InputNumber, Select, Switch } from "antd";
import type {
  BreadcrumbItem,
  DescriptionItem,
  DropdownMenuItem,
  EditableMenuItem,
  ListDataItem,
  SetterRendererProps,
  TableActionItem,
  TableColumnItem,
  TableDataRow,
  TabsItem,
  TreeNodeItem,
} from "../types";
import { MAX_TREE_DEPTH, normalizeBreadcrumbItems, normalizeDropdownMenuItems, normalizeEditableDescriptionsItems, normalizeEditableListDataSource, normalizeEditableMenuItems, normalizeEditableStepItems, normalizeEditableTableActions, normalizeEditableTableColumns, normalizeEditableTableDataSource, normalizeEditableTreeData, normalizeOptionItems, normalizeTabsItems } from "../utils/normalize";

export function OptionListSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeOptionItems(value);

  function updateAt(index: number, key: "label" | "value", nextValue: string) {
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

export function BreadcrumbItemsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
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

export function StepsItemsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableStepItems(value);

  function updateAt(
    index: number,
    key: "title" | "description",
    nextValue: string,
  ) {
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
            onChange={(event) => updateAt(index, "description", event.target.value)}
          />
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增步骤
      </Button>
    </div>
  );
}

export function TabsItemsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
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
            <span style={{ color: "#666", fontSize: 12 }}>面板 {index + 1}</span>
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

export function DropdownMenuItemsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeDropdownMenuItems(value);

  function updateAt(
    index: number,
    key: keyof DropdownMenuItem,
    nextValue: string | boolean,
  ) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: nextValue } : item,
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
            <span style={{ color: "#666", fontSize: 12 }}>菜单项 {index + 1}</span>
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

export function MenuItemsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
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

  function removeItemAtPath(
    items: EditableMenuItem[],
    path: number[],
  ): EditableMenuItem[] {
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
    function insertAtPath(
      items: EditableMenuItem[],
      currentPath: number[],
    ): EditableMenuItem[] {
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
        children: [...(item.children ?? []), createMenuItem(Date.now())],
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

  function renderItems(items: EditableMenuItem[], parentPath: number[] = []) {
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
              {renderItems(item.children, path)}
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

export function DescriptionsItemsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableDescriptionsItems(value);

  function updateAt(
    index: number,
    key: keyof DescriptionItem,
    nextValue: string | number,
  ) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: nextValue } : item,
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
            <span style={{ color: "#666", fontSize: 12 }}>键值项 {index + 1}</span>
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
            onChange={(nextValue) => updateAt(index, "span", Number(nextValue) || 1)}
          />
        </div>
      ))}
      <Button type="dashed" block onClick={addItem}>
        新增键值项
      </Button>
    </div>
  );
}

export function ListDataSourceSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableListDataSource(value);

  function updateAt(index: number, key: keyof ListDataItem, nextValue: string) {
    const nextItems = normalizedValue.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: nextValue } : item,
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
            <span style={{ color: "#666", fontSize: 12 }}>数据项 {index + 1}</span>
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

export function TableColumnsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableTableColumns(value);

  function updateAt(
    index: number,
    key: keyof TableColumnItem,
    nextValue: string | number | boolean | undefined,
  ) {
    onChange?.(
      normalizedValue.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: nextValue } : item,
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

export function TableDataSourceSetter({
  value,
  onChange,
  currentProps,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableTableDataSource(value);
  const normalizedColumns = normalizeEditableTableColumns(currentProps.columns).filter(
    (item) => item.dataIndex.trim() || item.key.trim(),
  );
  const resolvedRowKey = String(currentProps.rowKey ?? "").trim() || "key";

  function updateRowAt(index: number, key: string, nextValue: string) {
    onChange?.(
      normalizedValue.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: nextValue } : item,
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
            <span style={{ color: "#666", fontSize: 12 }}>行 {index + 1}</span>
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

export function TableActionsSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableTableActions(value);

  function updateAt(
    index: number,
    key: keyof TableActionItem,
    nextValue: string | boolean,
  ) {
    onChange?.(
      normalizedValue.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: nextValue } : item,
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

export function TreeDataSetter({
  value,
  onChange,
}: SetterRendererProps<unknown>) {
  const normalizedValue = normalizeEditableTreeData(value);

  function updateItems(
    items: TreeNodeItem[],
    path: number[],
    updater: (item: TreeNodeItem) => TreeNodeItem,
  ): TreeNodeItem[] {
    return items.map((item, index) => {
      if (index !== path[0]) {
        return item;
      }

      if (path.length === 1) {
        return updater(item);
      }

      return {
        ...item,
        children: updateItems(item.children ?? [], path.slice(1), updater),
      };
    });
  }

  function addRootItem() {
    const nextIndex = normalizedValue.length + 1;
    onChange?.([
      ...normalizedValue,
      {
        key: `tree-${nextIndex}`,
        title: `节点${nextIndex}`,
        disabled: false,
      },
    ]);
  }

  function addSibling(path: number[]) {
    const parentPath = path.slice(0, -1);
    const nextIndex = path[path.length - 1] + 2;
    const nextItem: TreeNodeItem = {
      key: `tree-${Date.now()}`,
      title: `节点${nextIndex}`,
      disabled: false,
    };

    if (parentPath.length === 0) {
      const nextItems = [...normalizedValue];
      nextItems.splice(path[0] + 1, 0, nextItem);
      onChange?.(nextItems);
      return;
    }

    onChange?.(
      updateItems(normalizedValue, parentPath, (item) => {
        const nextChildren = [...(item.children ?? [])];
        nextChildren.splice(path[path.length - 1] + 1, 0, nextItem);
        return {
          ...item,
          children: nextChildren,
        };
      }),
    );
  }

  function addChild(path: number[]) {
    onChange?.(
      updateItems(normalizedValue, path, (item) => {
        const nextChildren = [...(item.children ?? [])];
        nextChildren.push({
          key: `tree-${Date.now()}`,
          title: `子节点${nextChildren.length + 1}`,
          disabled: false,
        });
        return {
          ...item,
          children: nextChildren,
        };
      }),
    );
  }

  function removeItem(path: number[]) {
    function removeAt(items: TreeNodeItem[], currentPath: number[]): TreeNodeItem[] {
      if (currentPath.length === 1) {
        return items.filter((_, index) => index !== currentPath[0]);
      }

      return items.map((item, index) => {
        if (index !== currentPath[0]) {
          return item;
        }

        const nextChildren = removeAt(item.children ?? [], currentPath.slice(1));

        return {
          ...item,
          children: nextChildren.length > 0 ? nextChildren : undefined,
        };
      });
    }

    onChange?.(removeAt(normalizedValue, path));
  }

  function updateField(
    path: number[],
    key: keyof TreeNodeItem,
    nextValue: string | boolean,
  ) {
    onChange?.(
      updateItems(normalizedValue, path, (item) => ({
        ...item,
        [key]: nextValue,
      })),
    );
  }

  function renderItems(items: TreeNodeItem[], parentPath: number[] = []) {
    return items.map((item, index) => {
      const path = [...parentPath, index];
      const currentDepth = path.length;
      const canAddChild = currentDepth < MAX_TREE_DEPTH;

      return (
        <div
          key={path.join("-")}
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
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#666", fontSize: 12 }}>
              节点 {path.map((itemIndex) => itemIndex + 1).join(".")}
            </span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Button size="small" type="text" onClick={() => addSibling(path)}>
                新增同级
              </Button>
              <Button
                size="small"
                type="text"
                disabled={!canAddChild}
                onClick={() => addChild(path)}
              >
                新增子级
              </Button>
              <Button danger size="small" type="text" onClick={() => removeItem(path)}>
                删除
              </Button>
            </div>
          </div>
          {!canAddChild ? (
            <div style={{ color: "#999", fontSize: 12 }}>
              已达到最大层级限制，最多支持 {MAX_TREE_DEPTH} 层
            </div>
          ) : null}
          <Input
            placeholder="key"
            value={item.key}
            onChange={(event) => updateField(path, "key", event.target.value)}
          />
          <Input
            placeholder="标题"
            value={item.title}
            onChange={(event) => updateField(path, "title", event.target.value)}
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
              {renderItems(item.children, path)}
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
        新增根节点
      </Button>
    </div>
  );
}
