import { lazy, Suspense } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "../components/Header";
import { useComponentsStore } from "../stores/components";

const EditArea = lazy(() => import("../components/EditArea"));
const Setting = lazy(() =>
  import("../components/Setting").then((m) => ({ default: m.Setting }))
);
const MaterialWrapper = lazy(() => import("../components/MaterialWrapper"));
const Preview = lazy(() => import("../components/Preview"));

const ComponentLoading = () => <div className="lce-loading">Loading...</div>;

export default function LowcodeEditor() {
  const { mode } = useComponentsStore();

  return (
    <div className="lce-app">
      <div className="lce-header-shell">
        <Header />
      </div>
      {mode === "edit" ? (
        <Allotment className="lce-workspace">
          <Allotment.Pane preferredSize={260} maxSize={360} minSize={220}>
            <section className="lce-pane lce-pane-left">
              <Suspense fallback={<ComponentLoading />}>
                <MaterialWrapper />
              </Suspense>
            </section>
          </Allotment.Pane>
          <Allotment.Pane>
            <section className="lce-pane lce-pane-canvas">
              <Suspense fallback={<ComponentLoading />}>
                <EditArea />
              </Suspense>
            </section>
          </Allotment.Pane>
          <Allotment.Pane preferredSize={340} maxSize={520} minSize={320}>
            <section className="lce-pane lce-pane-right">
              <Suspense fallback={<ComponentLoading />}>
                <Setting />
              </Suspense>
            </section>
          </Allotment.Pane>
        </Allotment>
      ) : (
        <section className="lce-preview-shell">
          <Suspense fallback={<ComponentLoading />}>
            <Preview />
          </Suspense>
        </section>
      )}
    </div>
  );
}
