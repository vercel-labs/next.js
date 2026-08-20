import { Frame } from "./frame";

const src = process.env.IFRAME_SRC ?? "/remote?delay=100";

export default function Home() {
  return (
    <main>
      <h1>iframe onLoad</h1>
      <Frame title="Frame 1" src={src} />
      <Frame title="Frame 2" src={src} />
      <Frame title="Frame 3" src={src} />
    </main>
  );
}
