import { lazy, Suspense, useState } from "react";
import { Segmented } from "antd";

const Material = lazy(() => import("../Material"));
const Outline = lazy(() => import("../Outline"));
const Source = lazy(() => import("../Source"));

const tabs = [
  { label: "物料", value: "material" },
  { label: "大纲", value: "outline" },
  { label: "源码", value: "source" },
];

export default function MaterialWrapper() {
  const [key, setKey] = useState<string>("material");

  return (
    <div className="lce-material-wrapper">
      <Suspense fallback={<div className="lce-loading">Loading...</div>}>
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={tabs}
          className="lce-segmented"
        />
        <div className="lce-material-content">
          {key === "material" && <Material />}
          {key === "outline" && <Outline />}
          {key === "source" && <Source />}
        </div>
      </Suspense>
    </div>
  );
}
