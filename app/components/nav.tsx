import Link from 'next/link';

export default function Nav() {
  return (
    <div>
      <Link id="to-home" href="/">go /</Link>{' '}
      <Link id="to-test" href="/test">go /test</Link>
    </div>
  );
}
