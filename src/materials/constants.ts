export const PAGE_ALLOWED_PARENTS = [] as const;
export const CONTAINER_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const BUTTON_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const TEXT_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const DIVIDER_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const INPUT_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const FORM_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const IMAGE_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Space",
  "Flex",
  "Card",
  "Row",
  "Col",
] as const;
export const LINK_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Flex",
  "Space",
] as const;
export const TAG_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Flex",
  "Space",
] as const;
export const AVATAR_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Flex",
  "Space",
] as const;
export const ICON_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Flex",
  "Space",
  "Button",
] as const;
export const SPACE_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Drawer",
] as const;
export const FLEX_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Drawer",
] as const;
export const CARD_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Drawer",
] as const;
export const MODAL_ALLOWED_PARENTS = ["Page"] as const;
export const FORM_ITEM_ALLOWED_PARENTS = ["Form"] as const;
export const ROW_ALLOWED_PARENTS = [
  "Page",
  "Container",
  "Modal",
  "Card",
  "Drawer",
] as const;
export const COL_ALLOWED_PARENTS = ["Row"] as const;

export const MATERIAL_ALLOWED_PARENTS = {
  Page: PAGE_ALLOWED_PARENTS,
  Container: CONTAINER_ALLOWED_PARENTS,
  Button: BUTTON_ALLOWED_PARENTS,
  Text: TEXT_ALLOWED_PARENTS,
  Divider: DIVIDER_ALLOWED_PARENTS,
  Input: INPUT_ALLOWED_PARENTS,
  Form: FORM_ALLOWED_PARENTS,
  FormItem: FORM_ITEM_ALLOWED_PARENTS,
  Image: IMAGE_ALLOWED_PARENTS,
  Link: LINK_ALLOWED_PARENTS,
  Tag: TAG_ALLOWED_PARENTS,
  Avatar: AVATAR_ALLOWED_PARENTS,
  Icon: ICON_ALLOWED_PARENTS,
  Space: SPACE_ALLOWED_PARENTS,
  Flex: FLEX_ALLOWED_PARENTS,
  Card: CARD_ALLOWED_PARENTS,
  Modal: MODAL_ALLOWED_PARENTS,
  Row: ROW_ALLOWED_PARENTS,
  Col: COL_ALLOWED_PARENTS,
} as const;

export const MATERIAL_CATEGORY_ORDER = [
  "common",
  "navigation",
  "layout",
  "dataEntry",
  "form",
  "display",
  "feedback",
] as const;

export const MATERIAL_CATEGORY_LABELS = {
  common: "通用",
  navigation: "导航",
  layout: "布局",
  form: "表单",
  display: "展示",
  feedback: "反馈",
  dataEntry: "数据录入",
} as const;
