export default function ParentLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  console.log('[server] render ParentLayout');
  return (
    <div data-testid="parent-layout">
      <h1>Parent</h1>
      {children}
      {modal}
    </div>
  );
}
