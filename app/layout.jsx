export const metadata = { title: 'repro 86860' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="header">Header</div>
        <div id="content">{children}</div>
        <div id="footer">Footer</div>
      </body>
    </html>
  );
}
