import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import styles from './dashboard.module.css';

export default async function DashboardOverview() {
  const session = await getServerSession();
  if (!session?.user?.email) return <div>Please log in</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          emails: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    }
  });

  const project = user?.projects[0];
  if (!project) return <div>No project found.</div>;

  // Compute metrics
  const totalEmails = await prisma.email.count({ where: { projectId: project.id } });
  const delivered = await prisma.email.count({ where: { projectId: project.id, status: 'DELIVERED' } });
  const bounced = await prisma.email.count({ where: { projectId: project.id, status: 'FAILED' } });

  const deliveredPercent = totalEmails > 0 ? Math.round((delivered / totalEmails) * 100) : 0;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Overview</h1>
        <p className={styles.pageSubtitle}>Monitor your email delivery metrics.</p>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.card}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Sent</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>{totalEmails}</div>
        </div>
        <div className={styles.card}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Delivered</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>{deliveredPercent}%</div>
        </div>
        <div className={styles.card}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Bounced / Failed</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>{bounced}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
        <div className={styles.card}>
          {project.emails.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recent activity to display.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {project.emails.map(email => (
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
