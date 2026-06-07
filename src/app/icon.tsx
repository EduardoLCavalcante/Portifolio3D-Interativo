import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          gap: 4,
        }}
      >
        <div
          style={{
            width: 3,
            height: 18,
            background: "#ff3b30",
            transform: "rotate(12deg)",
            borderRadius: 1,
          }}
        />
        <span
          style={{
            color: "#f4f6f8",
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -0.5,
            marginTop: -1,
          }}
        >
          E
        </span>
      </div>
    ),
    { ...size },
  );
}
