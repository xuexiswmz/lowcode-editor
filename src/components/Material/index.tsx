import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import MaterialItem from "../MaterialItem";

export default function Material() {
  const { componentConfig } = useComponentConfigStore();
  const components = useMemo(() => {
    return Object.values(componentConfig).filter(
      (item) => item.name !== "Page"
    );
  }, [componentConfig]);
  return (
    <div>
      {components.map((item, index) => {
        return (
          <MaterialItem
            key={item.name + index}
            name={item.name}
            desc={item.desc}
          />
        );
      })}
    </div>
  );
}
