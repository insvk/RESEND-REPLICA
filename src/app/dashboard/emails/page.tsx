import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import styles from '../dashboard.module.css';

export default async function EmailsPage() {
  const session = await getServerSession();
  if (!session?.user?.email) return <div>Please log in</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          emails: {
            orderBy: { createdAt: 'desc' },
            take: 50 // Show last 50 emails
          }
        }
      }
    }
  });

  const emails = user?.projects[0]?.emails || [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Emails</h1>
        <p className={styles.pageSubtitle}>View your recent email logs and delivery status.</p>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No emails sent yet.
                </td>
              </tr>
            ) : (
              emails.map(email => (
                <tr key={email.id}>
                  <td>{email.to}</td>
                  <td>{email.subject}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      backgroundColor: email.status === 'SENT' || email.status === 'DELIVERED' ? 'rgba(34, 197, 94, 0.1)' : 
                                       email.status === 'FAILED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                      color: email.status === 'SENT' || email.status === 'DELIVERED' ? '#22c55e' : 
                             email.status === 'FAILED' ? '#ef4444' : 'inherit'
                    }}>
                      {email.status}
                    </span>
                  </td>
                  <td>{new Date(email.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
