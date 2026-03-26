import type { CSSProperties } from "react";
import { Tag as AntdTag } from "antd";
import { IconRenderer, normalizeIconInput } from "../Icon/shared";

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
        <AntdTag
            color={color}
            disabled={disabled}
            target={target}
            href={href}
            icon={iconNode}
            variant={variant}
            style={{ display:"inline-flex", alignItems: "center", gap:"5px", ...styles }}
        >
            {text}
        </AntdTag>
    );
}