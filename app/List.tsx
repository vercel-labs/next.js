import React from 'react';
import Item from './Item';
import ServerItem from './ServerItem';

export default function List({ children }: { children?: React.ReactNode }) {
  const info: string[] = [];
  React.Children.map(children, (child: any) => {
    const t = child?.type;
    info.push(
      JSON.stringify({
        typeof: typeof t,
        name: typeof t === 'function' ? t.name : undefined,
        displayName: t?.displayName ?? undefined,
        $$typeof: t?.$$typeof ? String(t.$$typeof) : undefined,
        isItem: t === Item,
        isServerItem: t === ServerItem,
      })
    );
    return child;
  });
  return (
    <div>
      <pre id="out">{info.join('\n')}</pre>
      {children}
    </div>
  );
}
