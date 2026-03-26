import { lazy } from "react";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const ContainerDev = lazy(() => import("./dev"));
const ContainerProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Container",
  category: "layout",
  desc: "容器",
  defaultProps: {},
  isContainer: true,
  allowedParents: SURFACE_PARENTS,
  dev: ContainerDev,
  prod: ContainerProd,
};

export default config;
