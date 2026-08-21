export default function RootLayout({ children, authModal }) {
  return (
    <html>
      <body>
        {children}
        {authModal}
      </body>
    </html>
  );
}
