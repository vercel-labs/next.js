import { action } from "./action";

export default function Home() {
  return (
    <div style={{ height: "50vh" }}>
      Home
      <form action={action}>
        <button type="submit">go home</button>
      </form>
    </div>
  );
}
