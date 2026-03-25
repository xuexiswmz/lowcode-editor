import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";

function normalizeHref(href: string) {
  if (!href) {
    return "#";
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  return `http://${href}`;
}

const Link = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      styles,
      text = "Link",
      href,
      target,
      underline = true,
      disabled = false,
    },
    ref,
  ) => {
    const normalizedHref = normalizeHref(href);
    const linkStyle = {
      color: disabled ? "#bfbfbf" : "#1890ff",
      cursor: disabled ? "not-allowed" : "pointer",
      textDecoration: underline ? "underline" : "none",
      pointerEvents: disabled ? "none" : "auto",
    } as const;

    return (
      <div ref={ref} data-component-id={id} style={styles}>
        <a
          href={disabled ? undefined : normalizedHref}
          target={target}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={
            disabled
              ? (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }
              : undefined
          }
          style={linkStyle}
        >
          {text}
        </a>
      </div>
    );
  },
);

export default Link;
