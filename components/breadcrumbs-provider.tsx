'use client';
import React from 'react';
import { BreadcrumbsContext } from '../lib/breadcrumbs-context';
export default function BreadcrumbsProvider({
  breadcrumbs,
  children,
}: { breadcrumbs: React.ReactNode; children: React.ReactNode }) {
  return (
    <BreadcrumbsContext.Provider value={breadcrumbs}>{children}</BreadcrumbsContext.Provider>
  );
}
