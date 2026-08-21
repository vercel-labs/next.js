import localFont from 'next/font/local';

const monaSpace = localFont({
  src: '../public/fonts/MyFont.var.woff2',
  display: 'swap',
  variable: '--font-monaspace',
  weight: '200 800',
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'font-variation-settings',
      value: '"wdth" 75, "slnt" 0',
    },
  ],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={monaSpace.variable}>
      <body>{children}</body>
    </html>
  );
}
