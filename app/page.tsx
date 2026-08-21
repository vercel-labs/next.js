import { merge } from "ts-deepmerge";

export default function Home() {
  return <pre>{JSON.stringify(merge({ a: { a: 1 } }, { a: { b: 2 } }))}</pre>;
}
