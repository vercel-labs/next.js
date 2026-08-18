const localeConfig = {
  locales: ['en-US', 'nl-NL'],
  defaultLocale: 'en-US',
};

export default async function TestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>App Router - Domain-based i18n with proxy.ts</h1>
      <div>
        <p>Current locale: <strong>{lang}</strong></p>
        <p>Available locales: <strong>{localeConfig.locales.join(', ')}</strong></p>
        <p>Default locale: <strong>{localeConfig.defaultLocale}</strong></p>
      </div>
    </div>
  );
}
