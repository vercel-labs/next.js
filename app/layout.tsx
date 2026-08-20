import styles from "./layout.module.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body className={styles.test}>{children}</body>
    </html>
  );
}
