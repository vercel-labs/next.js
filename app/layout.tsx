export const metadata = {
  title: 'OG fallback repro',
  metadataBase: new URL('https://example.com'),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
