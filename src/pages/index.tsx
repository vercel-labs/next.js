import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pages Router - Domain-based i18n</h1>
      <div>
        <p>Current locale: <strong>{locale}</strong></p>
        <p>Available locales: <strong>{locales?.join(', ')}</strong></p>
        <p>Default locale: <strong>{defaultLocale}</strong></p>
      </div>
    </div>
  );
}
