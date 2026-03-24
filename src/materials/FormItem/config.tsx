import FormItemDev from "./dev";
import FormItemProd from "./prod";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "FormItem",
  desc: "表单项",
  defaultProps: {
    label: "姓名",
    type: "input",
  },
  getDefaultProps: () => ({
    name: `field_${Date.now()}`,
  }),
  allowedParents: ["Form"],
  setter: [
    {
      name: "type",
      label: "类型",
      type: "select",
      options: [
        {
          label: "输入框",
          value: "input",
        },
        {
          label: "日期",
          value: "date",
        },
      ],
    },
    {
      name: "label",
      label: "标签",
      type: "input",
    },
    {
      name: "name",
      label: "字段",
      type: "input",
    },
  ],
  events: [
    {
      name: "onChange",
      label: "值变化事件",
    },
  ],
  dev: FormItemDev,
  prod: FormItemProd,
};

export default config;
