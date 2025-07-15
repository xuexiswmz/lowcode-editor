import { lazy, Suspense, useState } from "react";
import { Segmented } from "antd";

const Material = lazy(() => import("../Material"));
const Outline = lazy(() => import("../Outline"));
const Source = lazy(() => import("../Source"));

export default function MaterialWrapper() {
  const [key, setKey] = useState<string>("物料");
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={["物料", "大纲", "源码"]}
          style={{ padding: 5 }}
        />
        <div className="pt-[20px] h-[calc(100vh-60px-30px-20px)]">
          {key === "物料" && <Material />}
          {key === "大纲" && <Outline />}
          {key === "源码" && <Source />}
        </div>
      </Suspense>
    </div>
  );
}
