import Link from 'next/link';
export default function Index() {
  return (
    <ul>
      <li><Link href="/test">pages: test page WITHOUT hash</Link></li>
      <li><Link href="/test#anchor">pages: test page WITH hash</Link></li>
      <li><Link href="/app-test">app: test page WITHOUT hash</Link></li>
      <li><Link href="/app-test#anchor">app: test page WITH hash</Link></li>
    </ul>
  );
}
