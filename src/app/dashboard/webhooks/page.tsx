import styles from '../dashboard.module.css';

export default function WebhooksPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Webhooks</h1>
        <p className={styles.pageSubtitle}>Coming soon in Phase 9.</p>
      </div>
      <div className={styles.card}>
        <p style={{ color: 'var(--text-secondary)' }}>Webhook management UI will be added in a future update.</p>
      </div>
    </div>
  );
}
