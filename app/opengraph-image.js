import { ImageResponse } from "next/og";
// The problematic import: the OG image route imports the barrel file that also
// re-exports a "use client" component which imports a CSS module.
import * as components from "./components";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<div style={{ color: components.getColor() }}>Acme</div>);
}
