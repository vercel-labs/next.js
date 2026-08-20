import Link from "next/link";
import Image from "next/image";

function LinkWrapper({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link href="#" onClick={onClick}>
      Hello, world!
    </Link>
  );
}

// control: plain anchor works fine with exactOptionalPropertyTypes
function AnchorWrapper({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return <a onClick={onClick}>Hello, world!</a>;
}

export default function Page() {
  return (
    <>
      <LinkWrapper />
      <AnchorWrapper />
    </>
  );
}
