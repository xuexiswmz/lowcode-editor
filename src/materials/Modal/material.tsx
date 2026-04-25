import type React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import type { CommonComponentProps } from "../../interface";
import { MODAL_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import type { MaterialComponent } from "../types";
import { Modal, materials } from "../ui";

export interface ModalRef {
  open: () => void;
  close: () => void;
}

interface ModalProps extends CommonComponentProps {
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
  styles?: React.CSSProperties;
}

const ModalRenderer = forwardRef<ModalRef, ModalProps>(
  ({ children, title, onOk, onCancel, styles }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpen(true);
        },
        close: () => {
          setOpen(false);
        },
      }),
      [],
    );

    return (
      <Modal
        {...materials.Modal.mapProps(
          {
            title,
            open,
            styles,
            onOk: () => {
              onOk?.();
            },
            onCancel: () => {
              onCancel?.();
              setOpen(false);
            },
            destroyOnHidden: true,
          },
          { mode: "preview" },
        )}
      >
        {children}
      </Modal>
    );
  },
);

const ModalEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, title, styles }, ref) => (
    <div
      ref={ref}
      style={{
        minHeight: 160,
        padding: 20,
        border: "1px solid #000",
        borderRadius: 8,
        background: "#fff",
        ...styles,
      }}
      data-component-id={id}
    >
      <h4 style={{ margin: 0, marginBottom: 12 }}>{title}</h4>
      <div style={{ minHeight: 96 }}>
        {children ?? (
          <div
            style={{
              minHeight: 96,
              border: "1px dashed #d9d9d9",
              borderRadius: 8,
              background: "#fafafa",
              color: "#999",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            可在弹窗中拖入文本、按钮、表单、树、上传等组件
          </div>
        )}
      </div>
    </div>
  ),
);

export default createContainerMaterial({
  name: "Modal",
  category: "feedback",
  desc: "弹窗",
  defaultProps: {
    title: "弹窗",
  },
  isContainer: true,
  allowedParents: [...MODAL_ALLOWED_PARENTS],
  setter: [field.input("title", "标题")],
  stylesSetter: [],
  events: [
    { name: "onOk", label: "确认事件" },
    { name: "onCancel", label: "取消事件" },
  ],
  methods: [
    { name: "open", label: "打开弹窗" },
    { name: "close", label: "关闭弹窗" },
  ],
  render: ModalRenderer as MaterialComponent<CommonComponentProps>,
  renderInEditor: ModalEditorRenderer,
});
