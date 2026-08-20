import Link from "next/link";
export default function RiLayout({ children }) {
  return (
    <div>
      <h1>Route Interception</h1>
      <nav style={{ display: "flex", gap: 16 }}>
        <Link href="/ri/home" id="link-home">Home</Link>
        <Link href="/ri/payment" id="link-payment">Payment</Link>
        <Link href="/ri/progress" id="link-progress">Progress</Link>
      </nav>
      {children}
    </div>
  );
}
