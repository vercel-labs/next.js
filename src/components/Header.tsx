import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav aria-label="Main" className={styles.nav}>
        <Link className={styles.brand} href="/">
          Atlas UI
        </Link>
        <div className={styles.links}>
          <Link  href="/">
            Home
          </Link>
          <Link href="/dashboard">
            Dashboard
          </Link>
          <Link href="/dashboard/users">
            Users
          </Link>
        </div>
      </nav>
    </header>
  );
}
