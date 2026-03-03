import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import MaterialItem from "../MaterialItem";

export default function Material() {
  const { componentConfig } = useComponentConfigStore();
  const components = useMemo(() => {
    return Object.values(componentConfig).filter((item) => item.name !== "Page");
  }, [componentConfig]);

  return (
    <div className="lce-material-grid">
      {components.map((item, index) => (
        <MaterialItem key={item.name + index} name={item.name} desc={item.desc} />
      ))}
    </div>
  );
}
