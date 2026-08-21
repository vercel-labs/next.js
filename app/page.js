import Image from 'next/image';
import { logo } from 'my-assets';

export default function Page() {
  return (
    <main>
      <pre id="meta">{JSON.stringify(logo)}</pre>
      <pre id="type">{typeof logo}</pre>
      <Image id="img" src={logo} alt="logo from npm package" />
    </main>
  );
}
