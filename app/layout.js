export const metadata = {
  metadataBase: new URL('https://example.com'),
  title: 'repro',
};
export default function RootLayout({ children }) {
  return (<html><body>{children}</body></html>);
}
