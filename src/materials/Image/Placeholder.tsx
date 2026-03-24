import { PictureOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  styles?: CSSProperties;
}

function formatSizeValue(value: number | string | undefined, fallback: number) {
  return value ?? fallback;
}

function formatSizeLabel(value: number | string | undefined, fallback: number) {
  const resolved = value ?? fallback;
  return typeof resolved === "number" ? `${resolved}px` : resolved;
}

export default function ImagePlaceholder({
  width,
  height,
  styles,
}: ImagePlaceholderProps) {
  const resolvedWidth = formatSizeValue(width, 220);
  const resolvedHeight = formatSizeValue(height, 140);

  return (
    <div
      style={{
        ...styles,
        width: resolvedWidth,
        height: resolvedHeight,
        minWidth: 180,
        minHeight: 120,
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        border: "1px dashed #93b6f9",
        background:
          "linear-gradient(145deg, rgba(236, 244, 255, 0.98) 0%, rgba(248, 251, 255, 1) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 28px rgba(18, 119, 239, 0.10)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(18, 119, 239, 0.06) 25%, transparent 25%, transparent 50%, rgba(18, 119, 239, 0.06) 50%, rgba(18, 119, 239, 0.06) 75%, transparent 75%, transparent 100%)",
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 20,
          color: "#36507d",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1277ef 0%, #69a8ff 100%)",
            color: "#fff",
            boxShadow: "0 10px 24px rgba(18, 119, 239, 0.24)",
          }}
        >
          <PictureOutlined style={{ fontSize: 24 }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 800 }}>No image source</div>
        <div style={{ fontSize: 12, color: "#6e7f9d" }}>
          {formatSizeLabel(width, 220)} x {formatSizeLabel(height, 140)}
        </div>
      </div>
    </div>
  );
}
