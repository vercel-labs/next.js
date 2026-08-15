export const metadata = { title: 'Secret Terminal', description: 'repro' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
