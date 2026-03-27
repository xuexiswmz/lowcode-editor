import { Card as AntCard } from "antd";
import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { resolveCardCover } from "./shared";

const Card = forwardRef<HTMLDivElement, CommonComponentProps>(
  (
    {
      id,
      children,
      styles,
      title,
      cover,
      hoverable,
      loading,
      size,
      variant,
    },
    ref,
  ) => {
    return (
      <div ref={ref} data-component-id={id} style={styles}>
        <AntCard
          title={title}
          cover={resolveCardCover(cover, title)}
          hoverable={hoverable}
          loading={loading}
          size={size}
          variant={variant}
        >
          {children}
        </AntCard>
      </div>
    );
  },
);

export default Card;
