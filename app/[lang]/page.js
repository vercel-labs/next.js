import Counter from './counter'
export function generateStaticParams() { return [{ lang: 'en' }, { lang: 'fr' }] }
export default function Page() { return (<main><p>page</p><Counter /></main>) }
