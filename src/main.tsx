import "./index.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// 懒加载主应用
const App = lazy(() => import("./App.tsx"));

const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-lg">应用加载中...</div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <DndProvider backend={HTML5Backend}>
    <Suspense fallback={<LoadingIndicator />}>
      <App />
    </Suspense>
  </DndProvider>
);
