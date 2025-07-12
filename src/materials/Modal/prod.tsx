import type React from "react";
import type { CommonComponentProps } from "../../interface";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal as AntdModal } from "antd";

export interface ModalRef {
  open: () => void;
  close: () => void;
}

interface ModalProps extends Omit<CommonComponentProps, "ref"> {
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
  styles?: React.CSSProperties;
}

const Modal = (
  { children, title, onOk, onCancel, styles }: ModalProps,
  ref: React.Ref<ModalRef>
) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        open: () => {
          setOpen(true);
        },
        close: () => {
          setOpen(false);
        },
      };
    },
    []
  );

  return (
    <AntdModal
      title={title}
      open={open}
      style={styles}
      onOk={() => {
        onOk?.();
      }}
      onCancel={() => {
        onCancel?.();
        setOpen(false);
      }}
      destroyOnHidden
    >
      {children}
    </AntdModal>
  );
};
export default forwardRef<ModalRef, CommonComponentProps>(Modal);
