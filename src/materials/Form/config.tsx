import FormDev from "./dev";
import FormProd from "./prod";
import { SURFACE_PARENTS } from "../constants";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Form",
  category: "form",
  desc: "表单",
  defaultProps: {
    title: "表单",
  },
  isContainer: true,
  allowedParents: SURFACE_PARENTS,
  setter: [
    {
      name: "title",
      label: "标题",
      type: "input",
    },
  ],
  events: [
    {
      name: "onFinish",
      label: "提交事件",
    },
  ],
  methods: [
    {
      name: "submit",
      label: "提交",
    },
  ],
  dev: FormDev,
  prod: FormProd,
};

export default config;
