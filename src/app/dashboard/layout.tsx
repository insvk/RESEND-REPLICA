import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Resend Replica</div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Overview</Link>
          <Link href="/dashboard/emails" className={styles.navLink}>Emails</Link>
          <Link href="/dashboard/api-keys" className={styles.navLink}>API Keys</Link>
          <Link href="/dashboard/domains" className={styles.navLink}>Domains</Link>
          <Link href="/dashboard/webhooks" className={styles.navLink}>Webhooks</Link>
          <Link href="/dashboard/settings" className={styles.navLink}>Settings</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
