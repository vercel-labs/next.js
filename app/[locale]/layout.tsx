export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
