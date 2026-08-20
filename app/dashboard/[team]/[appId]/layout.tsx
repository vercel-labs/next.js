export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="layout">
      <h1>App layout</h1>
      {children}
      {modal}
      <div id="modal-root" />
    </div>
  );
}
