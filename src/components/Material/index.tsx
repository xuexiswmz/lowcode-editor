import { useMemo, useState } from "react";
import {
  MATERIAL_CATEGORY_LABELS,
  MATERIAL_CATEGORY_ORDER,
} from "../../materials/constants";
import { useComponentConfigStore } from "../../stores/component-config";
import MaterialItem from "../MaterialItem";

export default function Material() {
  const { componentConfig } = useComponentConfigStore();
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      MATERIAL_CATEGORY_ORDER.map((category) => [category, true]),
    ),
  );

  const groups = useMemo(() => {
    const components = Object.values(componentConfig).filter(
      (item) => item.name !== "Page",
    );

    return MATERIAL_CATEGORY_ORDER.map((category) => ({
      category,
      label: MATERIAL_CATEGORY_LABELS[category],
      items: components.filter(
        (item) => (item.category ?? "common") === category,
      ),
    })).filter((group) => group.items.length > 0);
  }, [componentConfig]);

  function toggleGroup(category: string) {
    setExpandedMap((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  return (
    <div className="lce-material-panel">
      {groups.map((group) => (
        <section key={group.category} className="lce-material-section">
          <button
            type="button"
            className="lce-material-section-head"
            onClick={() => toggleGroup(group.category)}
            aria-expanded={expandedMap[group.category]}
          >
            <div className="lce-material-section-heading">
              <div className="lce-material-section-title">{group.label}</div>
              <div className="lce-material-section-meta">{group.items.length} 个</div>
            </div>
            <span
              className={`lce-material-section-arrow ${
                expandedMap[group.category] ? "is-open" : ""
              }`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
          {expandedMap[group.category] && (
            <div className="lce-material-grid">
              {group.items.map((item) => (
                <MaterialItem key={item.name} name={item.name} desc={item.desc} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
