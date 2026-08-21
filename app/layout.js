export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <section className="flex-1">{children}</section>
      </body>
    </html>
  );
}
