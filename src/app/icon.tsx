import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #14b8a6, #4f46e5)",
          borderRadius: 96,
        }}
      >
        <div style={{ color: "white", fontSize: 300, fontWeight: 700, fontFamily: "sans-serif" }}>F</div>
      </div>
    ),
    { ...size }
  );
}
