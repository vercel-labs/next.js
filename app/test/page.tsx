import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <Link id="link" href="/?id=1">
        to /?id=1
      </Link>
    </div>
  );
}
