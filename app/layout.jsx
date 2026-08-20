export const metadata = { title: 'repro 57455' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header id="header" style={{ background: '#eee', padding: 8 }}>
          Root layout header (always visible)
        </header>
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
