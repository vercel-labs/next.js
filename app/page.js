'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // The reporter said they prefetch the param-less URL before pushing the
  // URL that carries query params.
  useEffect(() => {
    router.prefetch('/login/');
  }, [router]);

  return (
    <div>
      <h1 id="home">Home</h1>
      <button id="push-query" onClick={() => router.push('/login/?firstVisit=true')}>
        router.push(&quot;/login/?firstVisit=true&quot;)
      </button>
      <button id="push-plain" onClick={() => router.push('/login/')}>
        router.push(&quot;/login/&quot;)
      </button>
      <button id="push-post1q" onClick={() => router.push('/post/1/?a=1')}>
        router.push(&quot;/post/1/?a=1&quot;)
      </button>
      <Link id="l-login-q" href="/login/?firstVisit=true">Link /login/?firstVisit=true</Link>
    </div>
  );
}
