import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Demo App", template: "%s | Demo App" },
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
