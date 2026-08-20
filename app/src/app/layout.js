import { oxanium } from "@repro/ui/fonts.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={oxanium.className}>{children}</body>
    </html>
  );
}
