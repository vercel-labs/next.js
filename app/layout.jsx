import GtmHistoryProbe from './gtm-history-probe';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GtmHistoryProbe />
      </body>
    </html>
  );
}
