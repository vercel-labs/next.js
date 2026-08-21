import type { AppProps } from 'next/app';

// Import the bloat to increase bundle size
import '../lib/bloat';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
