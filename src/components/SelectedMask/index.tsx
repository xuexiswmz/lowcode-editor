import { useMemo } from "react";
import { Dropdown, Popconfirm, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";
import { getComponentById, useComponentsStore } from "../../stores/components";
import { useMaskPosition } from "../useMaskPosition";

interface SelectedMaskProps {
  containerClassName: string;
  componentId: number;
}

function SelectedMask({ containerClassName, componentId }: SelectedMaskProps) {
  const { components, deleteComponent, setCurComponentId } = useComponentsStore();
  const position = useMaskPosition(containerClassName, componentId, [components]);

  const el = useMemo(() => {
    return document.querySelector(`.${containerClassName}`);
  }, [containerClassName]);

  const curSelectedComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId, components]);

  function handleDelete() {
    deleteComponent(componentId);
    setCurComponentId(null);
  }

  const parentComponents = useMemo(() => {
    const parentComponents = [];
    let component = curSelectedComponent;
    while (component?.parentId) {
      component = getComponentById(component.parentId, components)!;
      parentComponents.push(component);
    }
    return parentComponents;
  }, [curSelectedComponent, components]);

  if (!el || !componentId) return null;
  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform:
            position.labelPlacement === "top"
              ? "translate(-100%, -100%)"
              : "translate(-100%, 0)",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((item) => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key);
              },
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: "0 8px",
                backgroundColor: "blue",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {curSelectedComponent?.desc}
            </div>
          </Dropdown>
          {componentId !== 1 && (
            <div style={{ padding: "0 8px", backgroundColor: "blue" }}>
              <Popconfirm
                title="确定删除该组件吗？"
                onConfirm={handleDelete}
                okText="是"
                cancelText="否"
              >
                <DeleteOutlined style={{ color: "#fff" }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el
  );
}
export default SelectedMask;
