import "./globals.css";

export const metadata = {
  title: "Turbopack NUL env repro",
  description: "Minimal Next Canary repro for Turbopack spawn diagnostics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
