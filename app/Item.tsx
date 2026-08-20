'use client';

export default function Item({ children }: { children?: React.ReactNode }) {
  return <div className="item">{children}</div>;
}
