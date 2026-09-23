import styles from '../dashboard.module.css';

export default function EmailsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Emails</h1>
        <p className={styles.pageSubtitle}>View your recent email deliveries and statuses.</p>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No emails sent yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
