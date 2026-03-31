import { forwardRef, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { useMaterialDrop } from "../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../interface";
import type { ComponentConfig, ComponentDefinition } from "./types";

function createPreviewComponent(definition: ComponentDefinition): ComponentConfig["prod"] {
  const RenderComponent = definition.render as any;

  return forwardRef<unknown, CommonComponentProps>((props, ref) => (
    <RenderComponent {...props} ref={ref} />
  ));
}

function createLeafEditorComponent(definition: ComponentDefinition): ComponentConfig["dev"] {
  const RenderComponent = (
    definition.renderInEditor ?? definition.render
  ) as any;

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

    return <RenderComponent {...props} ref={dragRef} />;
  }

  LeafEditor.displayName = `${definition.name}Editor`;
  return LeafEditor;
}

function createContainerEditorComponent(
  definition: ComponentDefinition,
): ComponentConfig["dev"] {
  const RenderComponent = (
    definition.renderInEditor ?? definition.render
  ) as any;

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

    return <RenderComponent {...props} ref={containerRef} />;
  }

  ContainerEditor.displayName = `${definition.name}ContainerEditor`;
  return ContainerEditor;
}

function createMaterialConfig(
  definition: ComponentDefinition,
  editorFactory: (definition: ComponentDefinition) => ComponentConfig["dev"],
): ComponentConfig {
  const { render: _render, renderInEditor: _renderInEditor, ...config } = definition;

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
