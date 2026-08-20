export const metadata = { title: "next/image flicker on refresh (#71077)" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* bright red body so any frame without the image/blur placeholder is obvious */}
      <body style={{ margin: 0, background: "red" }}>{children}</body>
    </html>
  );
}
