import styles from '../../dashboard.module.css';

export default function SettingsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Manage your account and project settings.</p>
      </div>
      <div className={styles.card}>
        <p style={{ color: 'var(--text-secondary)' }}>Project settings will be added here in a future update.</p>
      </div>
    </div>
  );
}
