import Link from 'next/link';
export default function DashboardLayout({ children, revenue, users }) {
  return (
    <div>
      <h1>Dashboard layout</h1>
      <Link id="to-archived" href="/dashboard/revenue/archived">View Archived Revenue Data</Link>
      <div id="children-slot">{children}</div>
      <div id="revenue-slot">{revenue}</div>
      <div id="users-slot">{users}</div>
    </div>
  );
}
