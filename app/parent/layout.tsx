export default function ParentLayout({ children, slot }: { children: React.ReactNode; slot: React.ReactNode }) {
  return (<div><div id="slot-area">{slot}</div><div id="children-area">{children}</div></div>);
}
