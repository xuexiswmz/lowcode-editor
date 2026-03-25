import type { CSSProperties, ComponentType } from "react";
import {
  AlertOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  HeartOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  MailOutlined,
  MenuOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import reactLogo from "../../assets/react.svg";

type AntdIconComponent = ComponentType<{
  className?: string;
  spin?: boolean;
  style?: CSSProperties;
}>;

export const sourceOptions = [
  { label: "Ant Design", value: "antd" },
  { label: "本地资源", value: "local" },
];

export const antdIconRegistry = {
  AlertOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  HeartOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  MailOutlined,
  MenuOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} satisfies Record<string, AntdIconComponent>;

export const localIconRegistry = {
  LCELogo: "/LCE.svg",
  ViteLogo: "/vite.svg",
  ReactLogo: reactLogo,
} as const;

export const antdIconOptions = Object.keys(antdIconRegistry).map((name) => ({
  label: `[antd] ${name}`,
  value: name,
}));

export const localIconOptions = Object.keys(localIconRegistry).map((name) => ({
  label: `[local] ${name}`,
  value: name,
}));

export const allIconOptions = [...antdIconOptions, ...localIconOptions];

export interface IconMaterialProps {
  source?: "antd" | "local";
  iconName?: string;
  localPath?: string;
  size?: number;
  spin?: boolean;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}

function getCommonStyle({
  size,
  style,
}: Pick<IconMaterialProps, "size" | "style">) {
  return {
    width: size,
    height: size,
    fontSize: size,
    color: "inherit",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    objectFit: "contain",
    ...style,
  } satisfies CSSProperties;
}

export function renderIcon({
  source = "antd",
  iconName = "HomeOutlined",
  localPath = "",
  size = 16,
  spin = false,
  rotate = 0,
  className,
  style,
}: IconMaterialProps) {
  const mergedStyle = getCommonStyle({ size, style });
  const wrapperStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };
  const localIconStyle: CSSProperties = {
    ...mergedStyle,
    animation: spin ? "lce-icon-spin 1s linear infinite" : undefined,
  };

  if (source === "local") {
    const src =
      iconName in localIconRegistry
        ? localIconRegistry[iconName as keyof typeof localIconRegistry]
        : localPath;

    if (!src) {
      return (
        <span className={className} style={mergedStyle}>
          ?
        </span>
      );
    }

    return (
      <span className={className} style={wrapperStyle}>
        <img
          alt={iconName || "local icon"}
          src={src}
          style={localIconStyle}
        />
      </span>
    );
  }

  const IconComponent =
    iconName in antdIconRegistry
      ? antdIconRegistry[iconName as keyof typeof antdIconRegistry]
      : undefined;

  if (!IconComponent) {
    return (
      <span className={className} style={mergedStyle}>
        ?
      </span>
    );
  }

  return (
    <span className={className} style={wrapperStyle}>
      <IconComponent spin={spin} style={mergedStyle} />
    </span>
  );
}
