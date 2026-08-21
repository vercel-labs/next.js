export const dynamic = "force-static";
export const revalidate = 86400;

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
