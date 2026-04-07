import type React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import type { CommonComponentProps } from "../../interface";
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
      style={styles}
      data-component-id={id}
      className="min-h-[100px] p-[20px] border-[1px] border-[#000] rounded-md"
    >
      <h4>{title}</h4>
      <div>{children}</div>
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
  allowedParents: ["Page"],
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
