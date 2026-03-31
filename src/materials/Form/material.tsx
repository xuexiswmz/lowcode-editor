import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  type ForwardRefRenderFunction,
  type ReactElement,
} from "react";
import { DatePicker, Form as AntdForm, Input } from "antd";
import dayjs from "dayjs";
import type { CommonComponentProps } from "../../interface";
import { SURFACE_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";

export interface FormRef {
  submit: () => void;
}

interface FormItem {
  label?: string;
  name?: string;
  type?: string;
  id?: number;
}

interface FormValues {
  [key: string]: unknown;
}

interface FormItemProps {
  label?: string;
  name?: string;
  type?: string;
  id?: number;
  formItems?: FormItem[];
}

interface FormProps extends Omit<CommonComponentProps, "id" | "name"> {
  formItems?: FormItem[];
}

const FormRenderer: ForwardRefRenderFunction<FormRef, FormProps> = (props, ref) => {
  const { children, onFinish, formItems: propFormItems } = props;
  const [form] = AntdForm.useForm();

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        form.submit();
      },
    }),
    [form],
  );

  const childFormItems = useMemo(() => {
    if (Array.isArray(children)) {
      return children
        .filter((child): child is ReactElement => React.isValidElement(child))
        .map((item) => ({
          label: item.props?.label,
          name: item.props?.name,
          type: item.props?.type,
          id: item.props?.id,
        }));
    }

    if (React.isValidElement(children)) {
      const childProps = children.props as FormItemProps;
      return [
        {
          label: childProps?.label,
          name: childProps?.name,
          type: childProps?.type,
          id: childProps?.id,
        } as FormItem,
      ];
    }

    const childrenProps = (children as { props?: FormItemProps })?.props;
    if (Array.isArray(childrenProps?.formItems)) {
      return childrenProps.formItems;
    }

    return [];
  }, [children]);

  const formItems = useMemo(() => {
    if (propFormItems && propFormItems.length > 0) {
      return propFormItems;
    }

    return childFormItems;
  }, [propFormItems, childFormItems]);

  async function save(values: FormValues) {
    Object.keys(values).forEach((key) => {
      if (dayjs.isDayjs(values[key])) {
        values[key] = values[key].format("YYYY-MM-DD");
      }
    });
    onFinish(values);
  }

  return (
    <AntdForm
      name="form"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      onFinish={save}
    >
      {formItems && formItems.length > 0 ? (
        formItems.map((item: FormItem) => (
          <AntdForm.Item key={item.name} name={item.name} label={item.label}>
            {item.type === "input" && <Input />}
            {item.type === "date" && <DatePicker />}
          </AntdForm.Item>
        ))
      ) : (
        <div>请添加表单项</div>
      )}
    </AntdForm>
  );
};

const FormEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, onFinish }, ref) => {
    const [form] = AntdForm.useForm();

    const formItems = useMemo(() => {
      return React.Children.toArray(children)
        .filter((child): child is ReactElement => React.isValidElement(child))
        .map((item) => ({
          label: item.props?.label,
          name: item.props?.name,
          type: item.props?.type,
          id: item.props?.id,
        } as FormItem));
    }, [children]);

    return (
      <div
        className="w-[100%] p-[20px] min-h-[100px] rounded-md border-[1px] border-[#000]"
        ref={ref}
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
          {formItems.map((item: FormItem) => (
            <AntdForm.Item
              key={item.name}
              label={item.label}
              data-component-id={item.id}
              name={item.name}
            >
              <Input style={{ pointerEvents: "none" }} />
            </AntdForm.Item>
          ))}
        </AntdForm>
      </div>
    );
  },
);

export default createContainerMaterial({
  name: "Form",
  category: "form",
  desc: "表单",
  defaultProps: {
    title: "表单",
  },
  isContainer: true,
  allowedParents: SURFACE_PARENTS,
  setter: [field.input("title", "标题")],
  events: [{ name: "onFinish", label: "提交事件" }],
  methods: [{ name: "submit", label: "提交" }],
  render: forwardRef(FormRenderer) as any,
  renderInEditor: FormEditorRenderer,
});
