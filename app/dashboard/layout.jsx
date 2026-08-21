import Navbar from "./navbar";

export default function DashboardLayout({ children }) {
  return (
    <main>
      <Navbar />
      <section>{children}</section>
    </main>
  );
}
