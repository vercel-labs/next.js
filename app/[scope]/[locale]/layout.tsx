// Root layout lives INSIDE the dynamic segments (mirrors the multi-tenant setup:
// no app/layout.tsx, html/body rendered per scope x locale).
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ scope: string; locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <html lang={locale}>
      <body>{props.children}</body>
    </html>
  );
}
