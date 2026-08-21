'use client';

import type { ComponentType } from 'react';

export function Header({ linkComponent: LinkComponent }: { linkComponent: ComponentType<any> }) {
  return <LinkComponent href="/">Home</LinkComponent>;
}
