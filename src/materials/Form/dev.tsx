import React, { useEffect, useMemo, useRef, type ReactElement } from "react";
import { Form as AntdForm, Input } from "antd";
import type { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { useDrag } from "react-dnd";

interface FormItem {
  label?: string;
  name?: string;
  type?: string;
  id?: number;
}

export default function Form({
  id,
  name,
  children,
  onFinish,
}: CommonComponentProps) {
  const [form] = AntdForm.useForm();
  const { canDrop, drop } = useMaterialDrop(["FormItem"], id);
  const divRef = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  const formItems = useMemo(() => {
    return React.Children.toArray(children)
      .filter((child): child is ReactElement => React.isValidElement(child))
      .map((item) => {
        return {
          label: item.props?.label,
          name: item.props?.name,
          type: item.props?.type,
          id: item.props?.id,
        } as FormItem;
      });
  }, [children]);

  return (
    <div
      className={`w-[100%] p-[20px] min-h-[100px] rounded-md ${
        canDrop ? "border-[2px] border-blue-500" : "border-[1px] border-[#000]"
      }`}
      ref={divRef}
      data-component-id={id}
    >
      <AntdForm
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={(values) => {
          onFinish(values);
        }}
      >
        {formItems.map((item: FormItem) => {
          return (
            <AntdForm.Item
              key={item.name}
              label={item.label}
              data-component-id={item.id}
              name={item.name}
            >
              <Input style={{ pointerEvents: "none" }} />
            </AntdForm.Item>
          );
        })}
      </AntdForm>
    </div>
  );
}
