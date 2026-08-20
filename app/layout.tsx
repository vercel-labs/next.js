export default function RootLayout({
  header,
  sidebar,
  comments,
  children,
}: {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  comments: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="header-slot">{header}</div>
        <div id="children-slot">{children}</div>
        <div id="comments-slot">{comments}</div>
        <div id="sidebar-slot">{sidebar}</div>
      </body>
    </html>
  );
}
