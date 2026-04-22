import {
  forwardRef,
  type ForwardedRef,
  type MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { TABLE_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Button, Table, materials } from "../ui";

type TableSize = "large" | "middle" | "small";
type TableAlign = "left" | "center" | "right";
type TableRenderType = "text" | "index" | "custom";
type TableActionType = "text" | "button";
type TableActionButtonStyle = "default" | "primary" | "link";

export interface TableColumnConfig {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  align?: TableAlign;
  ellipsis?: boolean;
  renderType?: TableRenderType;
  template?: string;
}

export interface TableActionConfig {
  key: string;
  label: string;
  type?: TableActionType;
  buttonType?: TableActionButtonStyle;
  danger?: boolean;
  disabled?: boolean;
}

export type TableDataRecord = Record<string, unknown>;

type TableProps = Omit<CommonComponentProps, "children"> & {
  columns?: TableColumnConfig[];
  dataSource?: TableDataRecord[];
  bordered?: boolean;
  size?: TableSize;
  pagination?: boolean;
  pageSize?: number;
  rowKey?: string;
  actions?: TableActionConfig[];
  actionsAlign?: TableAlign;
};

const defaultColumns: TableColumnConfig[] = [
  {
    key: "index",
    title: "序号",
    dataIndex: "__index__",
    width: 88,
    align: "center",
    renderType: "index",
  },
  {
    key: "name",
    title: "姓名",
    dataIndex: "name",
    width: 140,
    ellipsis: true,
  },
  {
    key: "role",
    title: "角色",
    dataIndex: "role",
    width: 140,
    ellipsis: true,
  },
  {
    key: "department",
    title: "部门",
    dataIndex: "department",
    width: 180,
    ellipsis: true,
  },
  {
    key: "status",
    title: "状态",
    dataIndex: "status",
    width: 120,
  },
  {
    key: "summary",
    title: "自定义信息",
    dataIndex: "summary",
    width: 240,
    ellipsis: true,
    renderType: "custom",
    template: "{{name}} / {{role}} / {{status}}",
  },
];

const defaultDataSource: TableDataRecord[] = [
  {
    key: "row-1",
    name: "张三",
    role: "前端工程师",
    department: "低代码平台",
    status: "启用",
  },
  {
    key: "row-2",
    name: "李四",
    role: "产品经理",
    department: "产品研发中心",
    status: "评审中",
  },
  {
    key: "row-3",
    name: "王五",
    role: "测试工程师",
    department: "质量保障组",
    status: "停用",
  },
];

const defaultActions: TableActionConfig[] = [
  {
    key: "edit",
    label: "编辑",
    type: "text",
  },
  {
    key: "delete",
    label: "删除",
    type: "text",
    danger: true,
  },
];

function normalizeTableSize(size: unknown): TableSize {
  return size === "large" || size === "small" ? size : "middle";
}

function normalizeTableColumns(columns: unknown): TableColumnConfig[] {
  if (!Array.isArray(columns)) {
    return [];
  }

  return columns
    .filter(
      (item): item is TableColumnConfig =>
        typeof item === "object" &&
        item !== null &&
        ("dataIndex" in item || "key" in item || "title" in item),
    )
    .map((item, index) => {
      const rawKey = String(item.key ?? "").trim();
      const rawDataIndex = String(item.dataIndex ?? "").trim();
      const fallbackKey = rawKey || rawDataIndex || `column-${index + 1}`;
      const numericWidth = Number(item.width);

      return {
        key: fallbackKey,
        title: String(item.title ?? "").trim() || rawDataIndex || `列${index + 1}`,
        dataIndex: rawDataIndex || fallbackKey,
        width:
          Number.isFinite(numericWidth) && numericWidth > 0
            ? numericWidth
            : undefined,
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

function normalizeTableDataSource(
  dataSource: unknown,
  rowKey: string,
): TableDataRecord[] {
  if (!Array.isArray(dataSource)) {
    return [];
  }

  return dataSource
    .filter(
      (item): item is TableDataRecord =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    )
    .map((item, index) => {
      const nextRecord = { ...item };
      const currentRowKey = nextRecord[rowKey];

      if (
        typeof currentRowKey !== "string" ||
        !currentRowKey.trim()
      ) {
        nextRecord[rowKey] = `row-${index + 1}`;
      }

      return nextRecord;
    });
}

function normalizeTableRowKey(rowKey: unknown) {
  return String(rowKey ?? "").trim() || "key";
}

function normalizeTablePageSize(pageSize: unknown) {
  const numericValue = Number(pageSize);
  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : 10;
}

function normalizeTableActions(actions: unknown): TableActionConfig[] {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions
    .filter(
      (item): item is TableActionConfig =>
        typeof item === "object" &&
        item !== null &&
        ("key" in item || "label" in item),
    )
    .map((item, index) => ({
      key: String(item.key ?? "").trim() || `action-${index + 1}`,
      label: String(item.label ?? "").trim() || `操作${index + 1}`,
      type: item.type === "button" ? "button" : "text",
      buttonType:
        item.buttonType === "primary" || item.buttonType === "link"
          ? item.buttonType
          : "default",
      danger: Boolean(item.danger),
      disabled: Boolean(item.disabled),
    }));
}

function normalizeTableActionsAlign(actionsAlign: unknown): TableAlign {
  return actionsAlign === "center" || actionsAlign === "right"
    ? actionsAlign
    : "left";
}

function normalizeTablePagination(
  pagination: unknown,
  dataLength: number,
  pageSize: number,
) {
  if (pagination === false) {
    return false;
  }

  return {
    pageSize,
    size: "small" as const,
    showSizeChanger: false,
    hideOnSinglePage: dataLength <= pageSize,
  };
}

function formatTableCellValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatTableCellValue(item)).join(" / ");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function resolveTemplateFields(template?: string) {
  if (!template?.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      [...template.matchAll(/\{\{\s*([^{}\s]+)\s*\}\}/g)].map((match) => match[1]),
    ),
  );
}

function formatTableTemplate(
  template: string | undefined,
  record: TableDataRecord,
): string {
  if (!template?.trim()) {
    return "-";
  }

  const renderedValue = template.replace(
    /\{\{\s*([^{}\s]+)\s*\}\}/g,
    (_, fieldName: string) => formatTableCellValue(record[fieldName]),
  );

  return renderedValue.trim() || "-";
}

function createAntdColumns(columns: TableColumnConfig[]) {
  return columns.map((column) => ({
    key: column.key,
    title: column.title,
    dataIndex: column.dataIndex,
    width: column.width,
    align: column.align,
    ellipsis: column.ellipsis,
    render: (value: unknown, record: TableDataRecord, index: number) => {
      if (column.renderType === "index") {
        return String(index + 1);
      }

      if (column.renderType === "custom") {
        return formatTableTemplate(column.template, record);
      }

      return formatTableCellValue(value);
    },
    shouldCellUpdate: (record: TableDataRecord, prevRecord: TableDataRecord) => {
      if (column.renderType === "index") {
        return false;
      }

      if (column.renderType === "custom") {
        const templateFields = resolveTemplateFields(column.template);

        if (templateFields.length === 0) {
          return false;
        }

        return templateFields.some(
          (fieldName) => record[fieldName] !== prevRecord[fieldName],
        );
      }

      return record[column.dataIndex] !== prevRecord[column.dataIndex];
    },
  }));
}

function createActionColumn(
  actions: TableActionConfig[],
  actionsAlign: TableAlign,
  onActionClick: TableProps["onActionClick"],
) {
  if (actions.length === 0) {
    return null;
  }

  return {
    key: "__actions__",
    title: "操作",
    dataIndex: "__actions__",
    fixed: "right" as const,
    width: Math.max(140, actions.length * 72),
    align: actionsAlign,
    render: (_value: unknown, record: TableDataRecord, index: number) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            actionsAlign === "center"
              ? "center"
              : actionsAlign === "right"
                ? "flex-end"
                : "flex-start",
          gap: 8,
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
        }}
      >
        {actions.map((action) =>
          action.type === "button" ? (
            <Button
              key={action.key}
              size="small"
              type={action.buttonType === "default" ? "default" : action.buttonType}
              danger={action.danger}
              disabled={action.disabled}
              onClick={(event) => {
                event.stopPropagation();
                onActionClick?.({
                  action,
                  record,
                  index,
                  event,
                });
              }}
            >
              {action.label}
            </Button>
          ) : (
            <span
              key={action.key}
              role="button"
              tabIndex={action.disabled ? -1 : 0}
              onClick={(event) => {
                event.stopPropagation();

                if (action.disabled) {
                  return;
                }

                onActionClick?.({
                  action,
                  record,
                  index,
                  event,
                });
              }}
              onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && !action.disabled) {
                  event.preventDefault();
                  event.stopPropagation();
                  onActionClick?.({
                    action,
                    record,
                    index,
                    event,
                  });
                }
              }}
              style={{
                color: action.disabled
                  ? "#bfbfbf"
                  : action.danger
                    ? "#ff4d4f"
                    : "#1677ff",
                cursor: action.disabled ? "not-allowed" : "pointer",
                userSelect: "none",
              }}
            >
              {action.label}
            </span>
          ),
        )}
      </div>
    ),
  };
}

function TableEmptyState({
  message,
  id,
  styles,
  tableRef,
}: {
  message: string;
  id: number;
  styles: CommonComponentProps["styles"];
  tableRef: ForwardedRef<HTMLDivElement>;
}) {
  return (
    <div
      ref={tableRef}
      data-component-id={id}
      style={{
        minHeight: 120,
        padding: 16,
        border: "1px dashed #d9d9d9",
        borderRadius: 8,
        background: "#fafafa",
        color: "#999",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(typeof styles === "object" && styles !== null ? styles : {}),
      }}
    >
      {message}
    </div>
  );
}

const TableRenderer = forwardRef<HTMLDivElement, TableProps>(
  (
    {
      id,
      columns,
      dataSource,
      bordered = false,
      size = "middle",
      pagination = true,
      pageSize = 10,
      rowKey = "key",
      actions,
      actionsAlign = "left",
      onChange,
      onActionClick,
      onRowClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedRowKey = normalizeTableRowKey(rowKey);
    const normalizedColumns = useMemo(
      () => normalizeTableColumns(columns ?? defaultColumns),
      [columns],
    );
    const normalizedDataSource = useMemo(
      () => normalizeTableDataSource(dataSource ?? defaultDataSource, normalizedRowKey),
      [dataSource, normalizedRowKey],
    );
    const normalizedActions = useMemo(
      () => normalizeTableActions(actions ?? defaultActions),
      [actions],
    );
    const normalizedActionsAlign = useMemo(
      () => normalizeTableActionsAlign(actionsAlign),
      [actionsAlign],
    );
    const antdColumns = useMemo(() => {
      const baseColumns = createAntdColumns(normalizedColumns);
      const actionColumn = createActionColumn(
        normalizedActions,
        normalizedActionsAlign,
        onActionClick,
      );

      return actionColumn ? [...baseColumns, actionColumn] : baseColumns;
    }, [normalizedColumns, normalizedActions, normalizedActionsAlign, onActionClick]);
    const normalizedPageSize = useMemo(
      () => normalizeTablePageSize(pageSize),
      [pageSize],
    );
    const normalizedPagination = useMemo(
      () =>
        normalizeTablePagination(
          pagination,
          normalizedDataSource.length,
          normalizedPageSize,
        ),
      [pagination, normalizedDataSource.length, normalizedPageSize],
    );

    if (antdColumns.length === 0) {
      return (
        <TableEmptyState
          tableRef={ref}
          id={id}
          styles={styles}
          message="请先在右侧配置 Table 列信息"
        />
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <Table
          {...materials.Table.mapProps(
            {
              columns: antdColumns,
              dataSource: normalizedDataSource,
              bordered,
              size: normalizeTableSize(size),
              pagination: normalizedPagination,
              rowKey: normalizedRowKey,
              scroll: { x: "max-content" },
              tableLayout: "fixed",
              locale: { emptyText: "暂无数据" },
              onChange,
              onRow: (record: TableDataRecord, index?: number) => ({
                onClick: (event: ReactMouseEvent<HTMLElement>) =>
                  onRowClick?.({
                    record,
                    index,
                    event,
                  }),
              }),
              styles,
              ...props,
            },
            { mode: "preview" },
          )}
        />
      </div>
    );
  },
);

const TableEditorRenderer = forwardRef<HTMLDivElement, TableProps>(
  (
    {
      id,
      columns,
      dataSource,
      bordered = false,
      size = "middle",
      pagination = true,
      pageSize = 10,
      rowKey = "key",
      actions,
      actionsAlign = "left",
      onChange,
      onActionClick,
      onRowClick,
      styles,
      ...props
    },
    ref,
  ) => {
    const normalizedRowKey = normalizeTableRowKey(rowKey);
    const normalizedColumns = useMemo(
      () => normalizeTableColumns(columns ?? defaultColumns),
      [columns],
    );
    const normalizedDataSource = useMemo(
      () => normalizeTableDataSource(dataSource ?? defaultDataSource, normalizedRowKey),
      [dataSource, normalizedRowKey],
    );
    const normalizedActions = useMemo(
      () => normalizeTableActions(actions ?? defaultActions),
      [actions],
    );
    const normalizedActionsAlign = useMemo(
      () => normalizeTableActionsAlign(actionsAlign),
      [actionsAlign],
    );
    const antdColumns = useMemo(() => {
      const baseColumns = createAntdColumns(normalizedColumns);
      const actionColumn = createActionColumn(
        normalizedActions,
        normalizedActionsAlign,
        onActionClick,
      );

      return actionColumn ? [...baseColumns, actionColumn] : baseColumns;
    }, [normalizedColumns, normalizedActions, normalizedActionsAlign, onActionClick]);
    const normalizedPageSize = useMemo(
      () => normalizeTablePageSize(pageSize),
      [pageSize],
    );
    const normalizedPagination = useMemo(
      () =>
        normalizeTablePagination(
          pagination,
          normalizedDataSource.length,
          normalizedPageSize,
        ),
      [pagination, normalizedDataSource.length, normalizedPageSize],
    );

    if (antdColumns.length === 0) {
      return (
        <TableEmptyState
          tableRef={ref}
          id={id}
          styles={styles}
          message="请先在右侧新增 Table 列"
        />
      );
    }

    return (
      <div ref={ref} data-component-id={id}>
        <Table
          {...materials.Table.mapProps(
            {
              columns: antdColumns,
              dataSource: normalizedDataSource,
              bordered,
              size: normalizeTableSize(size),
              pagination: normalizedPagination,
              rowKey: normalizedRowKey,
              scroll: { x: "max-content" },
              tableLayout: "fixed",
              locale: { emptyText: "请在右侧新增表格数据" },
              onChange,
              onRow: (record: TableDataRecord, index?: number) => ({
                onClick: (event: ReactMouseEvent<HTMLElement>) =>
                  onRowClick?.({
                    record,
                    index,
                    event,
                  }),
              }),
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        />
      </div>
    );
  },
);

TableRenderer.displayName = "TableRenderer";
TableEditorRenderer.displayName = "TableEditorRenderer";

export default createLeafMaterial({
  name: "Table",
  category: "display",
  desc: "表格",
  defaultProps: {
    columns: defaultColumns,
    dataSource: defaultDataSource,
    bordered: false,
    size: "middle",
    pagination: true,
    pageSize: 10,
    rowKey: "key",
    actions: defaultActions,
    actionsAlign: "left",
  },
  allowedParents: [...TABLE_ALLOWED_PARENTS],
  setter: [
    field.tableColumns("columns", "列配置"),
    field.tableDataSource("dataSource", "数据源"),
    field.tableActions("actions", "操作列"),
    field.switch("bordered", "带边框"),
    field.select("size", "尺寸", [
      { label: "大", value: "large" },
      { label: "中", value: "middle" },
      { label: "小", value: "small" },
    ]),
    field.switch("pagination", "分页"),
    field.inputNumber("pageSize", "每页条数"),
    field.input("rowKey", "行主键"),
    field.select("actionsAlign", "操作列对齐", [
      { label: "左对齐", value: "left" },
      { label: "居中", value: "center" },
      { label: "右对齐", value: "right" },
    ]),
  ],
  events: [
    { name: "onChange", label: "表格变化" },
    { name: "onRowClick", label: "行点击事件" },
    { name: "onActionClick", label: "操作点击事件" },
  ],
  render: TableRenderer,
  renderInEditor: TableEditorRenderer,
});
