import { useEffect } from "react";
import { useComponentsStore } from "../editor/stores/components";

export default function EditArea() {
  const { components, addComponent, deleteComponent, updateComponentProps } =
    useComponentsStore();
  useEffect(() => {
    addComponent(
      {
        id: 2,
        name: "container",
        props: {},
        children: [],
      },
      1
    );
    addComponent(
      {
        id: 3,
        name: "video",
        props: {},
        children: [],
      },
      2
    );
    setTimeout(() => {
      deleteComponent(3);
    }, 3000);
    updateComponentProps(2, {
      title: "Hello World",
    });
  }, []);
  return (
    <div>
      <pre>{JSON.stringify(components, null, 2)}</pre>
    </div>
  );
}
