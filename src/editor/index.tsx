import { lazy, Suspense } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "../components/Header";
import { useComponentsStore } from "../stores/components";

// 懒加载大型组件
const EditArea = lazy(() => import("../components/EditArea"));
const Setting = lazy(() =>
  import("../components/Setting").then((m) => ({ default: m.Setting }))
);
const MaterialWrapper = lazy(() => import("../components/MaterialWrapper"));
const Preview = lazy(() => import("../components/Preview"));

const ComponentLoading = () => (
  <div className="flex items-center justify-center h-full">加载中...</div>
);

export default function LowcodeEditor() {
  const { mode } = useComponentsStore();

  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-[60px] flex items-center border-b-[2px] border-[#a8a2a2]">
        <Header />
      </div>
      {mode === "edit" ? (
        <Allotment>
          <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
            <Suspense fallback={<ComponentLoading />}>
              <MaterialWrapper />
            </Suspense>
          </Allotment.Pane>
          <Allotment.Pane>
            <Suspense fallback={<ComponentLoading />}>
              <EditArea />
            </Suspense>
          </Allotment.Pane>
          <Allotment.Pane preferredSize={300} maxSize={500} minSize={375}>
            <Suspense fallback={<ComponentLoading />}>
              <Setting />
            </Suspense>
          </Allotment.Pane>
        </Allotment>
      ) : (
        <Suspense fallback={<ComponentLoading />}>
          <Preview />
        </Suspense>
      )}
    </div>
  );
}
