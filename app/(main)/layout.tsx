import { Suspense, type PropsWithChildren } from 'react';

// A Suspense boundary between the client provider and the dynamic route.
export default function MainLayout({ children }: PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}
