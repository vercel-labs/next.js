import { getTranslations } from 'next-intl/server';
import Nav from '../../nav';

export async function generateMetadata({ params }: any) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('title') + ' - test', description: t('description') + ' test' };
}

export default async function TestPage({ params }: any) {
  const { locale } = await params;
  return <div><h1>Test {locale}</h1><Nav /></div>;
}
