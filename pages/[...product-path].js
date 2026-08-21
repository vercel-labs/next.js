import { useRouter } from 'next/router';
import SearchTab from '../components/search';

export default function ProductPage({ url }) {
  const router = useRouter();
  const tab = router.query.tab === 'brand' ? 'brand' : 'product';

  const switchTab = (next) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', next);
    router.push(`${window.location.pathname}?${params.toString()}`, undefined, {
      shallow: true,
    });
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>tab: {tab}</h1>
      <button data-testid="tab-product" onClick={() => switchTab('product')}>
        product tab
      </button>
      <button data-testid="tab-brand" onClick={() => switchTab('brand')}>
        brand tab
      </button>
      {tab === 'product' ? (
        <SearchTab key="product" tab="product" url={url} />
      ) : (
        <SearchTab key="brand" tab="brand" url={url} />
      )}
    </main>
  );
}

export function getServerSideProps({ req }) {
  const protocol = req.headers.referer?.split('://')[0] || 'http';
  return { props: { url: `${protocol}://${req.headers.host}${req.url}` } };
}
