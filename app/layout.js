import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script id="before-interactive" strategy="beforeInteractive">
          {`console.log('beforeInteractive script executed'); window.__beforeInteractiveRan = true;`}
        </Script>
      </body>
    </html>
  );
}
