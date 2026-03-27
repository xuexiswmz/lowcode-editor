import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../../interface";
import { Card as AntCard } from "antd";
import { resolveCardCover } from "./shared";

const Card = ({
  id,
  children,
  styles,
  name,
  cover,
  hoverable,
  loading,
  variant,
  size,
  title,
}: CommonComponentProps) => {
  const { drop } = useMaterialDrop(id);
  const divRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, [drag, drop]);

  return (
    <div
      ref={divRef}
      data-component-id={id}
      style={styles}
    >
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
};

export default Card;
