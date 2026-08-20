export const metadata = { title: { default: 'default title', template: '%s | default title' } };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
