export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-shell">
      <Component {...pageProps} />
    </div>
  );
}
