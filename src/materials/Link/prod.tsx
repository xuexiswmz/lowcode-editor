import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { LinkRenderer } from "./shared";

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
    return (
      <div ref={ref} data-component-id={id}>
        <LinkRenderer
          href={href}
          target={target}
          text={text}
          underline={underline}
          disabled={disabled}
          styles={styles}
          onClick={
            disabled
              ? (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }
              : undefined
          }
        />
      </div>
    );
  },
);

export default Link;
