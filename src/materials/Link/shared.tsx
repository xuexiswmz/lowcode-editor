import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface LinkRendererProps {
  href?: string;
  target?: string;
  text?: ReactNode;
  underline?: boolean;
  disabled?: boolean;
  styles?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function normalizeHref(href?: string) {
  if (!href) {
    return "#";
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  return `http://${href}`;
}

export function getLinkStyle(disabled = false, underline = true): CSSProperties {
  return {
    color: disabled ? "#bfbfbf" : "#1890ff",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: underline ? "underline" : "none",
    pointerEvents: disabled ? "none" : "auto",
  };
}

export function LinkRenderer({
  href,
  target,
  text = "Link",
  underline = true,
  disabled = false,
  styles,
  onClick,
}: LinkRendererProps) {
  return (
    <a
      href={disabled ? undefined : normalizeHref(href)}
      target={target}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      onClick={onClick}
      style={{ ...getLinkStyle(disabled, underline), ...styles }}
    >
      {text}
    </a>
  );
}
