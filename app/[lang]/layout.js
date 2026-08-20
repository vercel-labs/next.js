export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }];
}

export default async function Layout({ children, params }) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
