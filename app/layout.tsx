import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 16.2.12 hydration check",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
