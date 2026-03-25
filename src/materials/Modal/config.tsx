import ModalDev from "./dev";
import ModalProd from "./prod";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "Modal",
  category: "feedback",
  desc: "弹窗",
  defaultProps: {
    title: "弹窗",
  },
  isContainer: true,
  allowedParents: ["Page"],
  setter: [
    {
      name: "title",
      label: "标题",
      type: "input",
    },
  ],
  stylesSetter: [],
  events: [
    {
      name: "onOk",
      label: "确认事件",
    },
    {
      name: "onCancel",
      label: "取消事件",
    },
  ],
  methods: [
    {
      name: "open",
      label: "打开弹窗",
    },
    {
      name: "close",
      label: "关闭弹窗",
    },
  ],
  dev: ModalDev,
  prod: ModalProd,
};

export default config;
