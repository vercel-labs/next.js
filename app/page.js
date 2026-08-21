import { BigStyles } from './big-styles';

export async function generateMetadata() {
  return {
    title: 'OG meta pushed past 32KB',
    openGraph: {
      title: 'OG meta pushed past 32KB',
      description: 'Slack will not unfurl this page',
      images: ['https://example.com/og.png'],
    },
  };
}

export default function Page() {
  return (
    <main>
      <BigStyles />
      <h1>hello</h1>
    </main>
  );
}
