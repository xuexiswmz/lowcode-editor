import PageDev from "./dev";
import PageProd from "./prod";
import type { ComponentConfig } from "../types";

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
