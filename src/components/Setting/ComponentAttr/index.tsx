import { Form } from "antd";
import { useComponentsStore } from "../../../stores/components";
import { useComponentConfigStore } from "../../../stores/component-config";
import AttrForm from "./AttrForm";
import { useComponentForm } from "./hooks/useComponentForm";

export default function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponentId, curComponent, components, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const config = curComponent ? componentConfig[curComponent.name] : undefined;
  const { handleValuesChange } = useComponentForm({
    form,
    curComponent,
    curComponentId,
    components,
    componentConfig,
    updateComponentProps,
  });

  if (!curComponent || !curComponentId || !config) {
    return null;
  }

  return (
    <AttrForm
      form={form}
      curComponent={curComponent}
      curComponentId={curComponentId}
      config={config}
      onValuesChange={handleValuesChange}
    />
  );
}
