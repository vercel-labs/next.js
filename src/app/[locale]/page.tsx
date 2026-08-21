import { getTranslations } from 'next-intl/server';
import Nav from '../nav';

export async function generateMetadata({ params, searchParams }: any) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const suffix = sp?.q ? ` | ${sp.q}` : '';
  return {
    title: t('title') + suffix,
    description: t('description') + suffix,
    openGraph: { title: t('title') + suffix, description: t('description'), type: 'website', locale }
  };
}

export default async function Page({ params, searchParams }: any) {
  const { locale } = await params;
  const sp = await searchParams;
  await new Promise((r) => setTimeout(r, 800));
  if (sp?.boom) throw new Error('Failed to fetch jobs');
  return <div><h1>Home {locale}</h1><Nav /></div>;
}
