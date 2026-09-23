import styles from '../dashboard.module.css';

export default function DomainsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Domains</h1>
        <p className={styles.pageSubtitle}>Verify your domains to send emails securely.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 500
        }}>
          Add Domain
        </button>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No domains verified.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
