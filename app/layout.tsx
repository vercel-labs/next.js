export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <h1>Layout</h1>
        <div id="children-slot">{children}</div>
        <div id="modal-slot">{modal}</div>
      </body>
    </html>
  );
}
