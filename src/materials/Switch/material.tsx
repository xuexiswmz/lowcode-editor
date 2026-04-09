import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { SWITCH_ALLOWED_PARENTS } from "../constants";
import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { Switch, materials } from "../ui";
import { useComponentsStore } from "../../stores/components";

type SwitchProps = Omit<CommonComponentProps, "children"> & {
  checked?: boolean;
  checkedChildren?: string;
  unCheckedChildren?: string;
  disabled?: boolean;
};

const SwitchRenderer = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      checked = false,
      checkedChildren = "开",
      unCheckedChildren = "关",
      disabled = false,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const { updateComponentProps } = useComponentsStore();

    const handleChange = (nextChecked: boolean) => {
      updateComponentProps(id, { checked: nextChecked });
      onChange?.(nextChecked);
    };

    return (
      <Switch
        ref={ref}
        {...materials.Switch.mapProps(
          {
            checked,
            checkedChildren,
            unCheckedChildren,
            disabled,
            onChange: handleChange,
            styles,
            ...props,
          },
          { mode: "preview" },
        )}
      />
    );
  },
);

const SwitchEditorRenderer = forwardRef<HTMLDivElement, SwitchProps>(
  (
    {
      id,
      checked = false,
      checkedChildren = "开",
      unCheckedChildren = "关",
      disabled = false,
      onChange,
      styles,
      ...props
    },
    ref,
  ) => {
    const { updateComponentProps } = useComponentsStore();

    const handleChange = (nextChecked: boolean) => {
      updateComponentProps(id, { checked: nextChecked });
      onChange?.(nextChecked);
    };

    return (
      <div ref={ref} data-component-id={id}>
        <Switch
          {...materials.Switch.mapProps(
            {
              checked,
              checkedChildren,
              unCheckedChildren,
              disabled,
              onChange: handleChange,
              styles,
              ...props,
            },
            { mode: "editor" },
          )}
        />
      </div>
    );
  },
);

SwitchRenderer.displayName = "SwitchRenderer";
SwitchEditorRenderer.displayName = "SwitchEditorRenderer";

export default createLeafMaterial({
  name: "Switch",
  category: "form",
  desc: "开关",
  defaultProps: {
    checked: false,
    checkedChildren: "开",
    unCheckedChildren: "关",
    disabled: false,
  },
  allowedParents: [...SWITCH_ALLOWED_PARENTS],
  setter: [
    field.switch("checked", "选中"),
    field.input("checkedChildren", "选中文字"),
    field.input("unCheckedChildren", "未选中文字"),
    field.switch("disabled", "禁用"),
  ],
  events: [{ name: "onChange", label: "值变化事件" }],
  methods: [
    { name: "focus", label: "聚焦" },
    { name: "blur", label: "失焦" },
  ],
  render: SwitchRenderer,
  renderInEditor: SwitchEditorRenderer,
});
