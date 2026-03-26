import { lazy } from "react";
import type { ComponentConfig } from "../types";

const PageDev = lazy(() => import("./dev"));
const PageProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Page",
  category: "layout",
  desc: "页面",
  defaultProps: {},
  isContainer: true,
  dev: PageDev,
  prod: PageProd,
};

export default config;
