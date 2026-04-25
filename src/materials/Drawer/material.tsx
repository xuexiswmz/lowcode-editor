import type React from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { DRAWER_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import type { MaterialComponent } from "../types";
import { Drawer, materials } from "../ui";

type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerRef {
  open: () => void;
  close: () => void;
}

type DrawerProps = CommonComponentProps & {
  title?: string;
  placement?: DrawerPlacement;
  width?: number;
  open?: boolean;
  mask?: boolean;
  closable?: boolean;
  onClose?: () => void;
  styles?: React.CSSProperties;
};

function normalizeDrawerPlacement(placement: unknown): DrawerPlacement {
  return placement === "left" || placement === "top" || placement === "bottom"
    ? placement
    : "right";
}

function normalizeDrawerWidth(width: unknown) {
  const numericValue = Number(width);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 360;
}

const DrawerRenderer = forwardRef<DrawerRef, DrawerProps>(
  (
    {
      children,
      title = "抽屉",
      placement = "right",
      width = 360,
      open: openProp = false,
      mask = true,
      closable = true,
      onClose,
      styles,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(Boolean(openProp));

    useEffect(() => {
      setOpen(Boolean(openProp));
    }, [openProp]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
      }),
      [],
    );

    return (
      <Drawer
        {...materials.Drawer.mapProps(
          {
            title,
            placement: normalizeDrawerPlacement(placement),
            width: normalizeDrawerWidth(width),
            open,
            mask,
            closable,
            getContainer: false,
            destroyOnHidden: true,
            onClose: () => {
              onClose?.();
              setOpen(false);
            },
            styles,
          },
          { mode: "preview" },
        )}
      >
        {children}
      </Drawer>
    );
  },
);

const DrawerEditorRenderer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      id,
      children,
      title = "抽屉",
      placement = "right",
      width = 360,
      styles,
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-component-id={id}
      style={{
        minHeight: 140,
        width: normalizeDrawerPlacement(placement) === "left" ||
          normalizeDrawerPlacement(placement) === "right"
          ? normalizeDrawerWidth(width)
          : "100%",
        maxWidth: "100%",
        padding: 20,
        border: "1px solid #000",
        borderRadius: 8,
        background: "#fff",
        ...styles,
      }}
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
            可在抽屉中拖入文本、按钮、表单、树、上传等组件
          </div>
        )}
      </div>
    </div>
  ),
);

DrawerRenderer.displayName = "DrawerRenderer";
DrawerEditorRenderer.displayName = "DrawerEditorRenderer";

export default createContainerMaterial({
  name: "Drawer",
  category: "feedback",
  desc: "抽屉",
  defaultProps: {
    title: "抽屉",
    placement: "right",
    width: 360,
    open: false,
    mask: true,
    closable: true,
  },
  isContainer: true,
  allowedParents: [...DRAWER_ALLOWED_PARENTS],
  setter: [
    field.input("title", "标题"),
    field.select("placement", "位置", [
      { label: "左", value: "left" },
      { label: "右", value: "right" },
      { label: "上", value: "top" },
      { label: "下", value: "bottom" },
    ]),
    field.inputNumber("width", "宽度"),
    field.switch("open", "打开"),
    field.switch("mask", "显示遮罩"),
    field.switch("closable", "显示关闭"),
  ],
  events: [{ name: "onClose", label: "关闭事件" }],
  methods: [
    { name: "open", label: "打开抽屉" },
    { name: "close", label: "关闭抽屉" },
  ],
  render: DrawerRenderer as MaterialComponent<CommonComponentProps>,
  renderInEditor: DrawerEditorRenderer,
});
