'use client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useRouter as useNextRouter } from 'next/navigation';

export default function Nav() {
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  return (
    <div>
      <button id="to-el" onClick={() => router.replace(pathname, { locale: 'el' })}>EL</button>
      <button id="to-en" onClick={() => router.replace(pathname, { locale: 'en' })}>EN</button>
      <button id="raw-replace-el" onClick={() => nextRouter.replace('/el')}>raw replace /el</button>
      <button id="boom" onClick={() => nextRouter.replace('/en?boom=1')}>boom</button>
      <button id="q1" onClick={() => nextRouter.replace(pathname === '/' ? '/?q=a' : '/en?q=a')}>q=a</button>
      <button id="q2" onClick={() => nextRouter.replace('/en?q=b')}>q=b</button>
      <button id="raw-replace-root" onClick={() => nextRouter.replace('/')}>raw replace /</button>
    </div>
  );
}
