import * as M from "../repro.js";

export default function Home() {
  return <pre>{Object.keys(M).join(", ")}</pre>;
}
