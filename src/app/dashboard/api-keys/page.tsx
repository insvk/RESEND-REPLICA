import styles from '../dashboard.module.css';

export default function ApiKeysPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>API Keys</h1>
        <p className={styles.pageSubtitle}>Manage API keys to authenticate your requests.</p>
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
          Create API Key
        </button>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Prefix</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No API keys found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
