export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <body>
            <div style={{backgroundColor: 'lightgray'}}>Menu bar</div>
            {children}
          </body>
    </html>
  );
}
