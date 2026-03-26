import { lazy } from "react";
import type { ComponentConfig } from "../types";
import { allIconOptions } from "../Icon/shared";

const AvatarDev = lazy(() => import("./dev"));
const AvatarProd = lazy(() => import("./prod"));

const config: ComponentConfig = {
  name: "Avatar",
  category: "display",
  desc: "头像",
  defaultProps: {
    alt: "",
    gap: 4,
    shape: "circle",
    size: "medium",
    text: "A",
  },
  allowedParents: ["Page", "Container", "Modal"],
  setter: [
    {
      name:'src',
      type:'input',
      label:'图片地址'
    },
    {
      name:'alt',
      type:'input',
      label:'替代文本'
    },
    {
      name:'gap',
      type:'input',
      label:'间距'
    },
    {
      name:'icon',
      type:'select',
      label:'图标',
      options: allIconOptions
    },
    {
      name:'shape',
      type:'select',
      label:'形状',
      options:[
        {label:'圆形', value:'circle'},
        {label:'方形', value:'square'}
      ]
    },
    {
      name:'size',
      type:'select',
      label:'大小',
      options:[
        {label:'小', value:'small'},
        {label:'中', value:'medium'},
        {label:'大', value:'large'}
      ]
    },
    {
      name:'text',
      type:'input',
      label:'头像内容'
    }
  ],
  stylesSetter: [],
  events: [],
  methods: [],
  dev: AvatarDev,
  prod: AvatarProd,
};

export default config;
