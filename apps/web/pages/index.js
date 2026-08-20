import Script from "next/script";
import { hello } from "ui";
export function getServerSideProps() { return { props: { msg: hello() } }; }
export default function Home({ msg }) {
  return <><Script src="/x.js" /><main id="msg">{msg}</main></>;
}
