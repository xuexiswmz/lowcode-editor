import { isValidElement, type ReactNode } from "react";

interface CardCoverConfig {
  src?: string;
  alt?: string;
}

function isCardCoverConfig(value: unknown): value is CardCoverConfig {
  return typeof value === "object" && value !== null && "src" in value;
}

export function resolveCardCover(
  cover: unknown,
  title?: string,
): ReactNode | undefined {
  if (!cover) {
    return undefined;
  }

  if (isValidElement(cover)) {
    return cover;
  }

  if (typeof cover === "string") {
    return (
      <img
        src={cover}
        alt={title || "card-cover"}
        style={{ display: "block", width: "100%", objectFit: "cover" }}
      />
    );
  }

  if (isCardCoverConfig(cover) && cover.src) {
    return (
      <img
        src={cover.src}
        alt={cover.alt || title || "card-cover"}
        style={{ display: "block", width: "100%", objectFit: "cover" }}
      />
    );
  }

  return undefined;
}
