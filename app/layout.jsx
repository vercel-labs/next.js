import "./globals.css";
export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
