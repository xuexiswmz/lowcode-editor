import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import SkeletonScreen from "./components/SkeletonScreen";

// 懒加载编辑器组件
const LowcodeEditor = lazy(() => import("./editor"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // 使用useEffect模拟加载过程，并在初始加载后移除骨架屏
  useEffect(() => {
    // 移除初始加载状态
    const initialLoader = document.querySelector(".initial-loader");
    if (initialLoader) {
      initialLoader.remove();
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<SkeletonScreen />}>
      {/* 在编辑器加载完成前显示骨架屏 */}
      {isLoading ? <SkeletonScreen /> : <LowcodeEditor />}
    </Suspense>
  );
}

export default App;
