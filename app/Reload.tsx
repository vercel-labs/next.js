'use client';

export default function Reload() {
  return (
    <button id="reload" onClick={() => location.reload()}>
      click to reload current page
    </button>
  );
}
