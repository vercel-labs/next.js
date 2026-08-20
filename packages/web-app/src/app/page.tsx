import { greet } from "rust-lib";

export default function Home() {
  return (
    <div>
      <h1>{greet("World")}</h1>
    </div>
  );
}
