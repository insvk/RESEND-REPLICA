import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import styles from '../dashboard.module.css';
import { AddDomainButton } from './AddDomainButton';

export default async function DomainsPage() {
  const session = await getServerSession();
  if (!session?.user?.email) return <div>Please log in</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: { domains: { include: { verifications: true } } }
      }
    }
  });

  const domains = user?.projects[0]?.domains || [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Domains</h1>
        <p className={styles.pageSubtitle}>Verify your domains to send emails securely.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <AddDomainButton />
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
            {domains.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No domains added.
                </td>
              </tr>
            ) : (
              domains.map(domain => (
                <tr key={domain.id}>
                  <td>{domain.name}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      backgroundColor: domain.status === 'VERIFIED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: domain.status === 'VERIFIED' ? '#22c55e' : '#eab308'
                    }}>
                      {domain.status}
                    </span>
                  </td>
                  <td>{new Date(domain.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}>
                      Verify DNS
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
