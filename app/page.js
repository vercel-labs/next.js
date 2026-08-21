import { a } from "../a.macro.js";
import { b } from "../b.macro.js";
import { c } from "../c.macro.js";

export default function Page() {
  return <p id="out">{a + b + c}</p>;
}
