import {
  createElement,
  forwardRef,
  useEffect,
  useRef,
  type ComponentType,
  type RefAttributes,
} from "react";
import { useDrag } from "react-dnd";
import { useMaterialDrop } from "../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../interface";
import type {
  ComponentConfig,
  ComponentDefinition,
} from "./types";

type ForwardableMaterialComponent<T = CommonComponentProps> = ComponentType<
  T & RefAttributes<unknown>
>;

function createPreviewComponent(definition: ComponentDefinition): ComponentConfig["prod"] {
  const RenderComponent =
    definition.render as ForwardableMaterialComponent<CommonComponentProps>;

  return forwardRef<unknown, CommonComponentProps>((props, ref) => {
    const renderProps = {
      ...props,
      ref,
    } as CommonComponentProps & RefAttributes<unknown>;

    return createElement(RenderComponent, renderProps);
  });
}

function createLeafEditorComponent(definition: ComponentDefinition): ComponentConfig["dev"] {
  const RenderComponent = (
    definition.renderInEditor ?? definition.render
  ) as ForwardableMaterialComponent<CommonComponentProps>;

  function LeafEditor(props: CommonComponentProps) {
    const { id, name } = props;
    const dragRef = useRef<unknown>(null);

    const [, drag] = useDrag({
      type: name,
      item: {
        type: name,
        dragType: "move",
        id,
      },
    });

    useEffect(() => {
      drag(dragRef);
    }, [drag]);

    return createElement(RenderComponent, { ...props, ref: dragRef });
  }

  LeafEditor.displayName = `${definition.name}Editor`;
  return LeafEditor;
}

function createContainerEditorComponent(
  definition: ComponentDefinition,
): ComponentConfig["dev"] {
  const RenderComponent = (
    definition.renderInEditor ?? definition.render
  ) as ForwardableMaterialComponent<CommonComponentProps>;

  function ContainerEditor(props: CommonComponentProps) {
    const { id, name } = props;
    const containerRef = useRef<unknown>(null);
    const { drop } = useMaterialDrop(id);

    const [, drag] = useDrag({
      type: name,
      item: {
        type: name,
        dragType: "move",
        id,
      },
    });

    useEffect(() => {
      drop(containerRef);
      drag(containerRef);
    }, [drag, drop]);

    return createElement(RenderComponent, { ...props, ref: containerRef });
  }

  ContainerEditor.displayName = `${definition.name}ContainerEditor`;
  return ContainerEditor;
}

function createMaterialConfig(
  definition: ComponentDefinition,
  editorFactory: (definition: ComponentDefinition) => ComponentConfig["dev"],
): ComponentConfig {
  const config = {
    ...definition,
  } as Omit<ComponentDefinition, "render" | "renderInEditor"> & {
    render?: ComponentDefinition["render"];
    renderInEditor?: ComponentDefinition["renderInEditor"];
  };

  delete config.render;
  delete config.renderInEditor;

  return {
    ...config,
    dev: editorFactory(definition),
    prod: createPreviewComponent(definition),
  };
}

export function createLeafMaterial(definition: ComponentDefinition): ComponentConfig {
  return createMaterialConfig(definition, createLeafEditorComponent);
}

export function createContainerMaterial(
  definition: ComponentDefinition,
): ComponentConfig {
  return createMaterialConfig(definition, createContainerEditorComponent);
}
