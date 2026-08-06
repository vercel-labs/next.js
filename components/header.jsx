// The entire content of the @header slot: a single `position: fixed` element.
// This is what the new scroll handler measures when it decides whether the
// navigation target is already in the viewport.
export default function Header({ label }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 8,
        left: 8,
        right: 8,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        background: '#222',
        color: '#fff',
        zIndex: 20,
      }}
    >
      {label}
    </header>
  );
}
