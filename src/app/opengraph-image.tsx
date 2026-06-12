import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const alt = `${siteConfig.name} | Creative Front-end Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#08090a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(244,246,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,246,248,0.05) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Cadmium vertical accent - right side */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 180,
            width: 1,
            height: "100%",
            background: "linear-gradient(180deg, transparent, #ff3b30 30%, #ff3b30 70%, transparent)",
            opacity: 0.55,
          }}
        />

        {/* Top label */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 72,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 3,
              height: 28,
              background: "#ff3b30",
              transform: "rotate(12deg)",
              borderRadius: 1,
            }}
          />
          <span style={{ color: "rgba(184,190,199,0.65)", fontSize: 16, letterSpacing: 1 }}>
            Creative Front-end Engineer
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              width: 52,
              height: 2,
              background: "#ff3b30",
              marginBottom: 28,
              borderRadius: 1,
            }}
          />
          <span
            style={{
              color: "#f4f6f8",
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: -3,
              maxWidth: 820,
            }}
          >
            Eduardo Cavalcante
          </span>
          <span
            style={{
              color: "rgba(184,190,199,0.5)",
              fontSize: 18,
              marginTop: 32,
              letterSpacing: 0.5,
              fontFamily: "monospace",
            }}
          >
            {siteConfig.domain}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
