import { wasmUrl } from "../src/big.mjs";

export default function Home() {
  return <p>data URI length: {wasmUrl.length}</p>;
}
