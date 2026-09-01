import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

export async function getCachedDoc(slug: string, locale: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`doc:${slug}:${locale}`);
  return { slug, locale, body: `Document ${slug} in ${locale} `.repeat(200) };
}
