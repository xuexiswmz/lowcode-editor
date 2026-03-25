import { useDrag } from "react-dnd";
import { useComponentsStore } from "../../stores/components";
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

export default function Link({
  id,
  name,
  styles,
  text = "链接",
  href,
  target,
  underline = true,
  disabled = false,
}: CommonComponentProps) {
  const { mode } = useComponentsStore();
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  const normalizedHref = normalizeHref(href);
  const isEditMode = mode === "edit";
  const linkStyle = {
    color: disabled ? "#bfbfbf" : "#1890ff",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: underline ? "underline" : "none",
    pointerEvents: disabled ? "none" : "auto",
  } as const;

  return (
    <div ref={drag} data-component-id={id} style={styles}>
      <a
        href={disabled ? undefined : normalizedHref}
        target={target}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={
          disabled || isEditMode
            ? (e) => {
                e.preventDefault();
                if (disabled) {
                  e.stopPropagation();
                }
              }
            : undefined
        }
        style={linkStyle}
      >
        {text}
      </a>
    </div>
  );
}
