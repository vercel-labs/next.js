import "fake-icons/styles.css";
import "../styles/globals.css";
import "../styles/local2.css";
import "fake-icons2/other.css";
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
