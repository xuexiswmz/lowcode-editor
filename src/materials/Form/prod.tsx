import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  type ForwardRefRenderFunction,
  type ReactElement,
} from "react";
import type { CommonComponentProps } from "../../interface";
import { Form as AntdForm, DatePicker, Input } from "antd";
import dayjs from "dayjs";

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

const Form: ForwardRefRenderFunction<FormRef, FormProps> = (props, ref) => {
  const { children, onFinish, formItems: propFormItems } = props;
  const [form] = AntdForm.useForm();
  useImperativeHandle(
    ref,
    () => {
      return {
        submit: () => {
          form.submit();
        },
      };
    },
    [form]
  );

  // 从children中获取FormItem的配置
  const childFormItems = useMemo(() => {
    // 如果children是数组，则直接使用
    if (Array.isArray(children)) {
      return children
        .filter((child): child is ReactElement => React.isValidElement(child))
        .map((item) => {
          return {
            label: item.props?.label,
            name: item.props?.name,
            type: item.props?.type,
            id: item.props?.id,
          } as FormItem;
        });
    }

    // 如果children是单个元素，则包装成数组
    if (React.isValidElement(children)) {
      const props = children.props as FormItemProps;
      return [
        {
          label: props?.label,
          name: props?.name,
          type: props?.type,
          id: props?.id,
        } as FormItem,
      ];
    }

    // 尝试从props中获取formItems
    const childrenProps = (children as { props?: FormItemProps })?.props;
    if (Array.isArray(childrenProps?.formItems)) {
      return childrenProps.formItems;
    }

    // 如果没有children，则返回空数组
    return [];
  }, [children]);

  // 合并从props传入的formItems和从children中获取的formItems
  const formItems = useMemo(() => {
    // 优先使用从props传入的formItems
    if (propFormItems && propFormItems.length > 0) {
      console.log("使用从props传入的formItems:", propFormItems);
      return propFormItems;
    }

    // 如果没有从props传入formItems，则使用从children中获取的formItems
    console.log("使用从children中获取的formItems:", childFormItems);
    return childFormItems;
  }, [propFormItems, childFormItems]);

  // 调试日志
  console.log("Form最终使用的formItems:", formItems);

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
        formItems.map((item: FormItem) => {
          return (
            <AntdForm.Item key={item.name} name={item.name} label={item.label}>
              {item.type === "input" && <Input />}
              {item.type === "date" && <DatePicker />}
            </AntdForm.Item>
          );
        })
      ) : (
        <div>请添加表单项</div>
      )}
    </AntdForm>
  );
};

export default forwardRef(Form);
