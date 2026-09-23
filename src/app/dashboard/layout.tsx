import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import styles from './dashboard.module.css';
import { SignOutButton } from './SignOutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  // Extra layer of protection on top of Middleware
  if (!session?.user?.email) {
    redirect('/login');
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div>
          <div className={styles.brand}>Resend Replica</div>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>Overview</Link>
            <Link href="/dashboard/emails" className={styles.navLink}>Emails</Link>
            <Link href="/dashboard/api-keys" className={styles.navLink}>API Keys</Link>
            <Link href="/dashboard/domains" className={styles.navLink}>Domains</Link>
            <Link href="/dashboard/webhooks" className={styles.navLink}>Webhooks</Link>
            <Link href="/dashboard/settings" className={styles.navLink}>Settings</Link>
          </nav>
        </div>
        
        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {session.user.email}
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
