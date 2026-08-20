import { boom } from "../lib/boom";

export default function Uncaught() {
  boom();
  return null;
}
