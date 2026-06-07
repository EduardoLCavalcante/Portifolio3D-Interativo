import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#08090a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 8,
            height: 72,
            background: "#ff3b30",
            transform: "rotate(12deg)",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            color: "#f4f6f8",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -2,
            marginTop: -4,
          }}
        >
          E
        </span>
      </div>
    ),
    { ...size },
  );
}
