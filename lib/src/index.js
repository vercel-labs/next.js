import { useState } from 'react';

export function Provider({ children }) {
  const [value] = useState('from-linked-lib');
  return <div id="provider" data-value={value}>{children}</div>;
}
