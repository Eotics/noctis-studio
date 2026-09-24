import { ImageResponse } from "next/og";

export const alt = "NOCTIS STUDIO — We design digital experiences that people remember.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#09090b",
          color: "#f1efea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 3, color: "#8d8c90" }}>
          <span>INDEPENDENT CREATIVE STUDIO — PARIS</span>
          <span style={{ color: "#ff3d00" }}>●</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 700, letterSpacing: -6, lineHeight: 0.9 }}>
          <span>WE DESIGN</span>
          <span>DIGITAL</span>
          <span>EXPERIENCES</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span style={{ fontWeight: 700, letterSpacing: -1 }}>NOCTIS</span>
          <span style={{ color: "#8d8c90", fontSize: 20, letterSpacing: 2 }}>THAT PEOPLE REMEMBER.</span>
        </div>
      </div>
    ),
    size,
  );
}
