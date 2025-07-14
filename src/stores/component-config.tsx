import { create } from "zustand";
import ContainerDev from "../materials/Container/dev";
import ButtonDev from "../materials/Button/dev";
import PageDev from "../materials/Page/dev";
import ContainerProd from "../materials/Container/prod";
import ButtonProd from "../materials/Button/prod";
import PageProd from "../materials/Page/prod";
import type { ComponentType } from "react";
import type { CommonComponentProps } from "../interface";
import ModalDev from "../materials/Modal/dev";
import ModalProd from "../materials/Modal/prod";
import InputDev from "../materials/Input/dev";
import InputProd from "../materials/Input/prod";

export interface componentSetter {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  [key: string]: unknown;
}

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentMethod {
  name: string;
  label: string;
}

export interface ComponentConfig<T = CommonComponentProps> {
  name: string;
  desc: string;
  setter?: componentSetter[];
  stylesSetter?: componentSetter[];
  defaultProps: Record<string, unknown>;
  dev: ComponentType<T>;
  prod: ComponentType<T>;
  events?: ComponentEvent[];
  methods?: ComponentMethod[];
}

interface State {
  componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: "Container",
      defaultProps: {},
      desc: "容器",
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: "Button",
      desc: "按钮",
      defaultProps: {
        type: "primary",
        text: "按钮",
        size: "middle",
        disabled: false,
        loading: false,
      },
      setter: [
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            { label: "主按钮", value: "primary" },
            { label: "次按钮", value: "default" },
            { label: "虚线按钮", value: "dashed" },
            { label: "文本按钮", value: "text" },
            { label: "链接按钮", value: "link" },
          ],
        },
        {
          name: "text",
          label: "文本",
          type: "input",
        },
        {
          name: "size",
          label: "大小",
          type: "select",
          options: [
            { label: "大", value: "large" },
            { label: "中", value: "middle" },
            { label: "小", value: "small" },
          ],
        },
        {
          name: "disabled",
          label: "禁用",
          type: "switch",
        },
        {
          name: "loading",
          label: "加载中",
          type: "switch",
        },
      ],
      stylesSetter: [
        {
          name: "margin",
          label: "外边距",
          type: "input",
        },
        {
          name: "padding",
          label: "内边距",
          type: "input",
        },
        {
          name: "borderRadius",
          label: "圆角",
          type: "inputNumber",
        },
      ],
      events: [
        {
          name: "onClick",
          label: "点击事件",
        },
        {
          name: "onDoubleClick",
          label: "双击事件",
        },
        {
          name: "onMouseEnter",
          label: "鼠标进入",
        },
        {
          name: "onMouseLeave",
          label: "鼠标离开",
        },
      ],
      dev: ButtonDev,
      prod: ButtonProd,
    },
    Page: {
      name: "Page",
      desc: "页面",
      defaultProps: {},
      dev: PageDev,
      prod: PageProd,
    },
    Modal: {
      name: "Modal",
      defaultProps: {
        title: "弹窗",
      },
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
      desc: "弹窗",
      dev: ModalDev,
      prod: ModalProd,
    },
    Input: {
      name: "Input",
      desc: "输入框",
      defaultProps: {
        value: "",
        placeholder: "请输入内容",
        disabled: false,
        maxLength: 10,
        type: "text",
      },
      setter: [
        {
          name: "value",
          label: "值",
          type: "input",
        },
        {
          name: "placeholder",
          label: "占位符",
          type: "input",
        },
        {
          name: "disabled",
          label: "禁用",
          type: "switch",
        },
        {
          name: "maxLength",
          label: "最大长度",
          type: "inputNumber",
        },
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            { label: "文本", value: "text" },
            { label: "密码", value: "password" },
            { label: "数字", value: "number" },
            { label: "邮箱", value: "email" },
            { label: "电话", value: "tel" },
            { label: "搜索", value: "search" },
            { label: "网址", value: "url" },
          ],
        },
      ],
      stylesSetter: [],
      events: [
        {
          name: "onChange",
          label: "值变化事件",
        },
        {
          name: "onFocus",
          label: "聚焦事件",
        },
        {
          name: "onBlur",
          label: "失去焦点事件",
        },
      ],
      dev: InputDev,
      prod: InputProd,
    },
  },

  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));
