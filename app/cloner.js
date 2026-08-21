'use client';
import { cloneElement, isValidElement } from 'react';

export function Cloner({ text, children }) {
  if (!isValidElement(children)) {
    console.log(
      '[Cloner] children is NOT a valid element, $$typeof =',
      String(children && children.$$typeof)
    );
  }
  return (
    <span data-len={text ? text.length : 0}>
      {cloneElement(children, { 'data-cloned': 'yes' })}
    </span>
  );
}

export function Leaf({ label, ...rest }) {
  return <b {...rest}>{label}</b>;
}
