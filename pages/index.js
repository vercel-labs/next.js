export default function Home({ host, cookie }) {
  return (
    <main>
      <h1>locale demo</h1>
      <p id="host">host: {host}</p>
      <p id="cookie">NEXT_LOCALE cookie: {cookie || '(none)'}</p>
    </main>
  );
}
export function getServerSideProps({ req, locale, locales, defaultLocale }) {
  return { props: { host: req.headers.host || '', cookie: req.cookies?.NEXT_LOCALE || null, locale, locales, defaultLocale } };
}
