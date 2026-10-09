import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const alt = "Satzstrategie — Wörter brauchen Haltung. Text. Design. Code.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [anton, caslon, sculpture] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/@fontsource/anton/files/anton-latin-400-normal.woff")),
    readFile(join(process.cwd(), "node_modules/@fontsource/libre-caslon-text/files/libre-caslon-text-latin-400-normal.woff")),
    readFile(join(process.cwd(), "public/images/papierarchitektur.webp")),
  ]);
  // The OG renderer does not decode WebP; convert the existing asset in memory.
  const image = await sharp(sculpture).resize(600, 600, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#f5f3ee", color: "#11110f", fontFamily: "Caslon" }}>
      <div style={{ display: "flex", height: 538, position: "relative", overflow: "hidden" }}>
        {/* The image is decorative; the title remains separately rendered text. */}
        <img src={`data:image/jpeg;base64,${image.toString("base64")}`} alt="" width={600} height={600} style={{ position: "absolute", right: 0, top: 0, objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "32px 48px", width: 690, position: "relative" }}>
          <div style={{ display: "flex", fontSize: 30, marginBottom: 20 }}>satzstrategie<span style={{ color: "#b32d23", marginLeft: 5 }}>]</span></div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Anton", fontSize: 110, lineHeight: 1.08, letterSpacing: "-2px" }}>
            <span>Wörter</span><span>brauchen</span><span>Haltung.</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 92, padding: "0 48px", background: "#b32d23", color: "#ffffff" }}>
        <span style={{ fontFamily: "Anton", fontSize: 48 }}>Text. Design. Code.</span><span style={{ fontSize: 24 }}>satzstrategie.de</span>
      </div>
    </div>,
    { ...size, fonts: [
      { name: "Anton", data: new Uint8Array(anton).buffer, weight: 400, style: "normal" },
      { name: "Caslon", data: new Uint8Array(caslon).buffer, weight: 400, style: "normal" },
    ] },
  );
}
