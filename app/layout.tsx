export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
}
