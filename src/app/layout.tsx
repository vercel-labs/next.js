import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hydration Repro",
  description: "Minimal reproduction for Turbopack hydration regression",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
