import Link from 'next/link';
import Card from './card';
// NOTE: this import comes *after* the Card import on purpose (see issue #75525)
import styles from './page.module.css';

export default function Page() {
  return (
    <main>
      <h1>home (square should be BLUE)</h1>
      <Card className={styles.square} />
      <Link id="to-other" href="/other">other</Link>
    </main>
  );
}
