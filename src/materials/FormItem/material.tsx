import { field } from "../fields";
import { createLeafMaterial } from "../factories";
import { FORM_ITEM_ALLOWED_PARENTS } from "../constants";

export default createLeafMaterial({
  name: "FormItem",
  category: "form",
  desc: "表单项",
  defaultProps: {
    label: "姓名",
    type: "input",
  },
  getDefaultProps: () => ({
    name: `field_${Date.now()}`,
  }),
  allowedParents: [...FORM_ITEM_ALLOWED_PARENTS],
  setter: [
    field.select("type", "类型", [
      { label: "输入框", value: "input" },
      { label: "日期", value: "date" },
    ]),
    field.input("label", "标签"),
    field.input("name", "字段"),
  ],
  events: [{ name: "onChange", label: "值变化事件" }],
  render: () => null,
});
