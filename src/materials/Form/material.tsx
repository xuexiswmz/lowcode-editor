import React, {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useMemo,
  type ReactElement,
} from "react";
import dayjs from "dayjs";
import type { CommonComponentProps } from "../../interface";
import { FORM_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createContainerMaterial } from "../factories";
import type { MaterialComponent } from "../types";
import { DatePicker, Form, Input, materials } from "../ui";

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

function isFormItemElement(child: ReactElement) {
  return child.props?.name === "FormItem";
}

interface FormProps {
  id: number;
  name: string;
  children?: ReactNode;
  styles?: CSSProperties;
  onFinish: (values: FormValues) => void;
  formItems?: FormItem[];
}

const FormRenderer = (props: FormProps, ref: ForwardedRef<FormRef>) => {
  const { children, onFinish, formItems: propFormItems } = props;
  const [form] = materials.Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        form.submit();
      },
    }),
    [form],
  );

  const validChildren = useMemo(
    () =>
      React.Children.toArray(children).filter((child): child is ReactElement =>
        React.isValidElement(child),
      ),
    [children],
  );

  const childFormItems = useMemo(
    () =>
      validChildren.filter(isFormItemElement).map((item) => ({
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
      })),
    [validChildren],
  );

  const normalChildren = useMemo(
    () => validChildren.filter((child) => !isFormItemElement(child)),
    [validChildren],
  );

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
    <Form
      {...materials.Form.mapProps(
        {
          form,
          onFinish: save,
        },
        { mode: "preview" },
      )}
    >
      {formItems && formItems.length > 0 ? (
        formItems.map((item: FormItem) => (
          <Form.Item
            {...materials.Form.mapItemProps(item, { mode: "preview" })}
          >
            {materials.Form.getFieldType(item.type, { mode: "preview" }) === "date" ? (
              <DatePicker />
            ) : (
              <Input />
            )}
          </Form.Item>
        ))
      ) : normalChildren.length > 0 ? (
        normalChildren
      ) : (
        <div>请添加表单项</div>
      )}
    </Form>
  );
};

const FormEditorRenderer = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, onFinish }, ref) => {
    const [form] = materials.Form.useForm();

    const validChildren = useMemo(
      () =>
        React.Children.toArray(children).filter((child): child is ReactElement =>
          React.isValidElement(child),
        ),
      [children],
    );

    const formItems = useMemo(
      () =>
        validChildren.filter(isFormItemElement).map((item) => ({
          label: item.props?.label,
          name: item.props?.name,
          type: item.props?.type,
          id: item.props?.id,
        } as FormItem)),
      [validChildren],
    );

    const normalChildren = useMemo(
      () => validChildren.filter((child) => !isFormItemElement(child)),
      [validChildren],
    );

    return (
      <div
        className="w-[100%] p-[20px] min-h-[100px] rounded-md border-[1px] border-[#000]"
        ref={ref}
        data-component-id={id}
      >
        <Form
          {...materials.Form.mapProps(
            {
              form,
              onFinish: (values) => {
                onFinish(values);
              },
            },
            { mode: "editor" },
          )}
        >
          {formItems.map((item: FormItem) => (
            <Form.Item
              data-component-id={item.id}
              {...materials.Form.mapItemProps(item, { mode: "editor" })}
            >
              {materials.Form.getFieldType(item.type, { mode: "editor" }) ===
              "date" ? (
                <DatePicker
                  style={materials.Form.getPreviewInputStyle(undefined, {
                    mode: "editor",
                  })}
                />
              ) : (
                <Input
                  style={materials.Form.getPreviewInputStyle(undefined, {
                    mode: "editor",
                  })}
                />
              )}
            </Form.Item>
          ))}
          {normalChildren}
        </Form>
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
  allowedParents: [...FORM_ALLOWED_PARENTS],
  setter: [field.input("title", "标题")],
  events: [{ name: "onFinish", label: "提交事件" }],
  methods: [{ name: "submit", label: "提交" }],
  render: forwardRef(FormRenderer) as MaterialComponent<CommonComponentProps>,
  renderInEditor: FormEditorRenderer,
});
