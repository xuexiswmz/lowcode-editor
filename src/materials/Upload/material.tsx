import { UploadOutlined } from "@ant-design/icons";
import { Button as AntdButton, type UploadFile, type UploadProps } from "antd";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { useComponentsStore } from "../../stores/components";
import { UPLOAD_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Upload, materials } from "../ui";

interface SerializedUploadFile {
  uid: string;
  name: string;
  status?: UploadFile["status"];
  url?: string;
  thumbUrl?: string;
  type?: string;
  size?: number;
  percent?: number;
  response?: unknown;
}

export interface UploadMaterialRef {
  clear: () => void;
}

type UploadListType = "text" | "picture" | "picture-card" | "picture-circle";

type UploadMaterialProps = Omit<CommonComponentProps, "children"> & {
  action?: string;
  listType?: UploadListType;
  maxCount?: number;
  accept?: string;
  multiple?: boolean;
  fileList?: SerializedUploadFile[];
};

const listTypeOptions = [
  { label: "文本", value: "text" },
  { label: "图片列表", value: "picture" },
  { label: "图片卡片", value: "picture-card" },
  { label: "圆形图片", value: "picture-circle" },
];

function normalizeUploadFileList(fileList: unknown): UploadFile[] {
  if (!Array.isArray(fileList)) {
    return [];
  }

  return fileList
    .filter(
      (item): item is SerializedUploadFile =>
        typeof item === "object" && item !== null && "uid" in item && "name" in item,
    )
    .map((item) => ({
      uid: String(item.uid),
      name: String(item.name),
      status: item.status,
      url: item.url,
      thumbUrl: item.thumbUrl,
      type: item.type,
      size: item.size,
      percent: item.percent,
      response: item.response,
    }));
}

function serializeUploadFileList(fileList: UploadFile[]): SerializedUploadFile[] {
  return fileList.map((file) => ({
    uid: String(file.uid),
    name: file.name,
    status: file.status,
    url: file.url,
    thumbUrl: file.thumbUrl,
    type: file.type,
    size: file.size,
    percent: file.percent,
    response: file.response,
  }));
}

function normalizeUploadListType(listType: unknown): UploadListType {
  return listType === "picture" ||
    listType === "picture-card" ||
    listType === "picture-circle"
    ? listType
    : "text";
}

function useManagedUploadFiles(
  id: number,
  fileList: unknown,
) {
  const { updateComponentProps } = useComponentsStore();
  const normalizedFileList = useMemo(
    () => normalizeUploadFileList(fileList),
    [fileList],
  );
  const [internalFileList, setInternalFileList] = useState<UploadFile[]>(normalizedFileList);

  useEffect(() => {
    setInternalFileList(normalizedFileList);
  }, [normalizedFileList]);

  function updateFileList(nextFileList: UploadFile[]) {
    setInternalFileList(nextFileList);
    updateComponentProps(id, {
      fileList: serializeUploadFileList(nextFileList),
    });
  }

  function clearFiles() {
    updateFileList([]);
  }

  return {
    internalFileList,
    updateFileList,
    clearFiles,
  };
}

const UploadRenderer = forwardRef<UploadMaterialRef, UploadMaterialProps>(
  (
    {
      id,
      action = "",
      listType = "text",
      maxCount,
      accept,
      multiple = false,
      fileList,
      onChange,
      onPreview,
      onRemove,
      styles,
      ...props
    },
    ref,
  ) => {
    const { internalFileList, updateFileList, clearFiles } = useManagedUploadFiles(
      id,
      fileList,
    );
    const normalizedListType = normalizeUploadListType(listType);

    useImperativeHandle(ref, () => ({
      clear: clearFiles,
    }), [clearFiles]);

    const uploadProps = materials.Upload.mapProps(
      {
        action,
        listType: normalizedListType,
        maxCount,
        accept,
        multiple,
        fileList: internalFileList,
        beforeUpload: action ? undefined : () => false,
        onChange: (info: Parameters<NonNullable<UploadProps["onChange"]>>[0]) => {
          updateFileList(info.fileList);
          onChange?.(info);
        },
        onPreview,
        onRemove: (file: UploadFile) => onRemove?.(file),
        styles,
        ...props,
      },
      { mode: "preview" },
    );

    return (
      <Upload {...uploadProps}>
        <AntdButton icon={<UploadOutlined />}>点击上传</AntdButton>
      </Upload>
    );
  },
);

const UploadEditorRenderer = forwardRef<HTMLDivElement, UploadMaterialProps>(
  (
    {
      id,
      action = "",
      listType = "text",
      maxCount,
      accept,
      multiple = false,
      fileList,
      onChange,
      onPreview,
      onRemove,
      styles,
      ...props
    },
    ref,
  ) => {
    const { internalFileList, updateFileList } = useManagedUploadFiles(id, fileList);
    const normalizedListType = normalizeUploadListType(listType);

    const uploadProps = materials.Upload.mapProps(
      {
        action,
        listType: normalizedListType,
        maxCount,
        accept,
        multiple,
        fileList: internalFileList,
        beforeUpload: () => false,
        onChange: (info: Parameters<NonNullable<UploadProps["onChange"]>>[0]) => {
          updateFileList(info.fileList);
          onChange?.(info);
        },
        onPreview,
        onRemove: (file: UploadFile) => onRemove?.(file),
        openFileDialogOnClick: true,
        styles,
        ...props,
      },
      { mode: "editor" },
    );

    return (
      <div ref={ref} data-component-id={id}>
        <Upload {...uploadProps}>
          <AntdButton icon={<UploadOutlined />}>点击上传</AntdButton>
        </Upload>
      </div>
    );
  },
);

UploadRenderer.displayName = "UploadRenderer";
UploadEditorRenderer.displayName = "UploadEditorRenderer";

export default createLeafMaterial({
  name: "Upload",
  category: "form",
  desc: "上传",
  defaultProps: {
    action: "",
    listType: "text",
    maxCount: undefined,
    accept: "",
    multiple: false,
    fileList: [],
  },
  allowedParents: [...UPLOAD_ALLOWED_PARENTS],
  setter: [
    field.input("action", "上传地址"),
    field.select("listType", "列表类型", listTypeOptions),
    field.inputNumber("maxCount", "最大数量"),
    field.input("accept", "文件类型"),
    field.switch("multiple", "允许多选"),
    field.readonlyJson("fileList", "文件列表"),
  ],
  events: [
    { name: "onChange", label: "上传变化事件" },
    { name: "onPreview", label: "预览事件" },
    { name: "onRemove", label: "移除事件" },
  ],
  methods: [{ name: "clear", label: "清空" }],
  render: UploadRenderer,
  renderInEditor: UploadEditorRenderer,
});
