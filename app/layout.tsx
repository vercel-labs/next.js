export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body style={{ margin: 0 }}>
        <header style={{ backgroundColor: "red" }}>Header</header>
        {children}
        <footer style={{ backgroundColor: "blue" }}>Footer</footer>
      </body>
    </html>
  );
}
