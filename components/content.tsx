'use client';
import React, { isValidElement, use } from 'react';
import { BreadcrumbsContext } from '../lib/breadcrumbs-context';
export function Content({ children }: { children: React.ReactNode }) {
  const breadcrumbs = use(BreadcrumbsContext);
  return (
    <div>
      {isValidElement(breadcrumbs) && breadcrumbs}
      {children}
    </div>
  );
}
