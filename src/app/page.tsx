import { IS_DEVELOPMENT } from "~/constants";

export default function Page() {
  return <p>alias works here: {String(IS_DEVELOPMENT)}</p>;
}
