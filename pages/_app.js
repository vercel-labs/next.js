import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';

export default function MyApp({ Component, pageProps, ...rest }) {
  return (
    <AppCacheProvider {...rest}>
      <Component {...pageProps} />
    </AppCacheProvider>
  );
}
