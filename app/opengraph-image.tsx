import { ImageResponse } from "next/og";

export const alt = "Rudransh Villa — private 2 bedroom villa with a pool and garden";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", height: "100%", width: "100%", background: "#202928", color: "#fffdf9", padding: "72px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", position: "absolute", right: "-115px", top: "-145px", height: "560px", width: "560px", borderRadius: "50%", background: "#316b63" }} />
      <div style={{ display: "flex", position: "absolute", right: "145px", bottom: "-170px", height: "430px", width: "430px", borderRadius: "50%", border: "2px solid #d16746" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", zIndex: 1 }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 7, fontWeight: 700, color: "#ffd39c" }}>RUDRANSH VILLA</div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "850px" }}>
          <div style={{ display: "flex", fontSize: 82, lineHeight: 1, letterSpacing: -4, fontWeight: 600 }}>Your private</div>
          <div style={{ display: "flex", fontSize: 82, lineHeight: 1, letterSpacing: -4, fontWeight: 600, color: "#ffd39c" }}>staycation.</div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 27, color: "#d8e9e3" }}>2 bedrooms · Private pool · Garden · Time together</div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#d8e9e3" }}>Check availability directly on WhatsApp</div>
      </div>
    </div>,
    size,
  );
}
