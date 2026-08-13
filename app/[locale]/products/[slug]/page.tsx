import { connection } from 'next/server';
import { headers } from 'next/headers';

export const instant = false;

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  await connection();
  const { locale, slug } = await params;
  const h = await headers();
  return (
    <main>
      <p>locale: {locale} slug: {slug}</p>
      <p>ua: {h.get('user-agent')}</p>
      <p>rendered at: {new Date().toISOString()}</p>
    </main>
  );
}
