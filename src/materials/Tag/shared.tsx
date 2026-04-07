import type { CSSProperties } from "react";
import { IconRenderer, normalizeIconInput } from "../Icon/shared";
import { Tag, materials } from "../ui";

interface TagRendererProps {
    color?: string;
    disabled?: boolean;
    target?: string;
    href?: string;
    icon?: unknown;
    variant?: "solid" | "filled" | "outlined";
    styles?: CSSProperties;
    text?: string;
}

export function getFontSizeValue(styles?: CSSProperties, fallback = 12) {
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


export function TagRenderer({
    color,
    disabled,
    target,
    href,
    icon,
    variant,
    styles,
    text
}: TagRendererProps) {
    const iconConfig = normalizeIconInput(icon, getFontSizeValue(styles));
    const iconNode = iconConfig?.iconName ? <IconRenderer {...iconConfig} /> : undefined;
    return (
        <Tag
            {...materials.Tag.mapProps(
              {
                color,
                disabled,
                target,
                href,
                icon: iconNode,
                variant,
                styles,
              },
              { mode: "preview" },
            )}
        >
            {text}
        </Tag>
    );
}
