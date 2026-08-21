import styles from "./styles.module.scss";

export default function Page() {
  return (
    <main>
      <p id="target" className={styles.c}>text</p>
      <pre id="classnames">{JSON.stringify(styles, null, 2)}</pre>
    </main>
  );
}
