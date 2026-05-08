import { Form } from "antd";
import { useEffect } from "react";
import type { Component } from "../../../../stores/components";
import type { ComponentConfig } from "../../../../stores/component-config";
import { useComponentsStore } from "../../../../stores/components";

interface UseComponentFormParams {
  form: ReturnType<typeof Form.useForm>[0];
  curComponent: Component | null;
  curComponentId?: number | null;
  components: Component[];
  componentConfig: Record<string, ComponentConfig>;
  updateComponentProps: ReturnType<typeof useComponentsStore.getState>["updateComponentProps"];
}

function getFormValues(
  config: ComponentConfig | undefined,
  defaultProps: Record<string, unknown>,
  currentProps: Record<string, unknown>,
) {
  const mergedProps = {
    ...defaultProps,
    ...currentProps,
  };

  return config?.propsAdapter?.toFormValues?.(mergedProps, defaultProps) ?? mergedProps;
}

export function useComponentForm({
  form,
  curComponent,
  curComponentId,
  components,
  componentConfig,
  updateComponentProps,
}: UseComponentFormParams) {
  useEffect(() => {
    if (!curComponent) {
      return;
    }

    const config = componentConfig[curComponent.name];
    form.setFieldsValue(
      getFormValues(
        config,
        (config?.defaultProps as Record<string, unknown>) ?? {},
        curComponent.props as Record<string, unknown>,
      ),
    );
  }, [curComponent, components, componentConfig, form]);

  function handleValuesChange(changeValues: Record<string, unknown>) {
    if (!curComponentId || !curComponent) {
      return;
    }

    const config = componentConfig[curComponent.name];
    const defaultProps = (config?.defaultProps as Record<string, unknown>) ?? {};
    const prevProps = {
      ...defaultProps,
      ...(curComponent.props as Record<string, unknown>),
    };
    const nextPatch =
      config?.propsAdapter?.fromFormPatch?.(changeValues, prevProps, defaultProps) ??
      changeValues;

    updateComponentProps(curComponentId, nextPatch);
  }

  return {
    handleValuesChange,
  };
}
