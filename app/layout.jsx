export const metadata = { title: 'fixed-slot scroll repro' };

// `header` is the @header parallel route slot.
export default function RootLayout({ children, header }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {header}
        {children}
      </body>
    </html>
  );
}
