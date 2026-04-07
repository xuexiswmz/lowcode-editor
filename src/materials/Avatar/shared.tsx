import type { CSSProperties } from "react";
import { IconRenderer, normalizeIconInput } from "../Icon/shared";
import { Avatar, materials } from "../ui";

interface AvatarRendererProps {
  alt?: string;
  gap?: number | string;
  icon?: unknown;
  shape?: "circle" | "square";
  size?: number | "small" | "default" | "large" | "medium";
  src?: string;
  styles?: CSSProperties;
  text?: string;
}

export function getFontSizeValue(styles?: CSSProperties, fallback = 16) {
  const fontSize = styles?.fontSize;

  if (typeof fontSize === "number") {
    return fontSize;
  }

  if (typeof fontSize === "string") {
    const parsed = Number.parseFloat(fontSize);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

function normalizeGap(gap?: number | string) {
  if (typeof gap === "number") {
    return gap;
  }

  if (typeof gap === "string") {
    const parsed = Number.parseFloat(gap);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

export function AvatarRenderer({
  alt,
  gap,
  icon,
  shape,
  size,
  src,
  styles,
  text,
}: AvatarRendererProps) {
  const iconConfig = normalizeIconInput(icon, getFontSizeValue(styles));
  const iconNode = iconConfig?.iconName ? <IconRenderer {...iconConfig} /> : undefined;

  return (
    <Avatar
      {...materials.Avatar.mapProps(
        {
          alt,
          gap: normalizeGap(gap),
          icon: iconNode,
          shape,
          size,
          src,
          styles,
        },
        { mode: "preview" },
      )}
    >
      {text}
    </Avatar>
  );
}
