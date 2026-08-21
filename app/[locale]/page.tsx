import BlockList from '../../components/BlockList';

export function generateStaticParams() { return [{ locale: 'en' }]; }

export default async function Page() {
  return <main><BlockList /></main>;
}
