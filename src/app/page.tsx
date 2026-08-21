import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href='/'>Link to root</Link>
      <br />
      <Link href='/foo/bar'>Link to /foo/bar (inside route group)</Link>
    </div>
  );
}
