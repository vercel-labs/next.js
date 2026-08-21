import styles from "./page.module.css";

const users = [
  {
    name: "Avery Kim",
    role: "Admin",
    email: "avery.kim@example.com",
    status: "Active",
    lastSeen: "Today, 9:12 AM",
  },
  {
    name: "Sofia Ortega",
    role: "Analyst",
    email: "sofia.ortega@example.com",
    status: "Active",
    lastSeen: "Yesterday, 4:45 PM",
  },
  {
    name: "Jordan Lee",
    role: "Engineer",
    email: "jordan.lee@example.com",
    status: "Pending",
    lastSeen: "Jan 24, 2026",
  },
  {
    name: "Riley Chen",
    role: "Designer",
    email: "riley.chen@example.com",
    status: "Inactive",
    lastSeen: "Jan 18, 2026",
  },
];

export default function DashboardUsersPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Team</p>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>
            Manage access and view recent activity.
          </p>
        </div>
        <a href="/dashboard">
          Back to Dashboard
        </a>
      </header>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last seen</span>
        </div>
        {users.map((user) => (
          <div className={styles.tableRow} key={user.email}>
            <div>
              <p className={styles.name}>{user.name}</p>
              <p className={styles.email}>{user.email}</p>
            </div>
            <span className={styles.role}>{user.role}</span>
            <span
              className={`${styles.status} ${
                styles[user.status.toLowerCase()]
              }`}
            >
              {user.status}
            </span>
            <span className={styles.lastSeen}>{user.lastSeen}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
