import styles from './dashboard.module.css';

export default function DashboardOverview() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Overview</h1>
        <p className={styles.pageSubtitle}>Monitor your email delivery metrics.</p>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.card}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Sent</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>0</div>
        </div>
        <div className={styles.card}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Delivered</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>0%</div>
        </div>
        <div className={styles.card}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Bounced</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>0</div>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
        <div className={styles.card}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
