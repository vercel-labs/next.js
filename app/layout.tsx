export default function RootLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div id="children">{props.children}</div>
        <div id="modal-slot">{props.modal}</div>
      </body>
    </html>
  );
}
