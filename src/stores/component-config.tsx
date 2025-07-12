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
        text: "button",
      },
      setter: [
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            { label: "主按钮", value: "primary" },
            { label: "次按钮", value: "default" },
          ],
        },
        {
          name: "text",
          label: "文本",
          type: "input",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
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
      stylesSeteer: [],
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
