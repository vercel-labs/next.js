import React from 'react';
import BreadcrumbsProvider from '../components/breadcrumbs-provider';
export default function Layout({
  breadcrumbs,
  children,
}: { breadcrumbs: React.ReactNode; children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BreadcrumbsProvider breadcrumbs={breadcrumbs}>
          <main>{children}</main>
        </BreadcrumbsProvider>
      </body>
    </html>
  );
}
