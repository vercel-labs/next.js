import a from "../styles/a.module.css";
import b from "../styles/b.module.scss";

export default function Page() {
  return (
    <main className={b.box}>
      <h1 className={a.title}>hello</h1>
    </main>
  );
}
