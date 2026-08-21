import { Inter } from "next/font/google";

const devFont = Inter({ subsets: ["latin"] });

const computeFont = async () => {
  if (process.env.PROPRIETARY_FONT === "TTNormsPro") {
    const { ttNormsPro } = await import("../styles/fonts");
    return ttNormsPro;
  }
  return devFont;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const font = await computeFont();
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
