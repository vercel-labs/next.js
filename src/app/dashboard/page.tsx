import styles from "./page.module.css";

const kpis = [
  { label: "Active Users", value: "1,284", change: "+6.2%" },
  { label: "Monthly Revenue", value: "$42,190", change: "+3.1%" },
  { label: "Conversion Rate", value: "4.7%", change: "-0.4%" },
  { label: "Avg. Response", value: "1.6s", change: "-8.9%" },
];

const activity = [
  {
    title: "Quarterly report generated",
    detail: "Finance summary PDF created",
    time: "12 mins ago",
  },
  {
    title: "New team member onboarded",
    detail: "Access granted to project Aurora",
    time: "2 hours ago",
  },
  {
    title: "Alerts resolved",
    detail: "Latency spike mitigated",
    time: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Overview</p>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            A quick glance at the latest signals.
          </p>
        </div>
        <a href="/dashboard/users">View Users</a>
      </header>

      <div className={styles.grid}>
        {kpis.map((kpi) => (
          <div className={styles.card} key={kpi.label}>
            <p className={styles.label}>{kpi.label}</p>
            <div className={styles.valueRow}>
              <span className={styles.value}>{kpi.value}</span>
              <span className={styles.change}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.activity}>
        <h2 className={styles.sectionTitle}>Recent activity</h2>
        <ul className={styles.list}>
          {activity.map((item) => (
            <li className={styles.listItem} key={item.title}>
              <div>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemDetail}>{item.detail}</p>
              </div>
              <span className={styles.time}>{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
