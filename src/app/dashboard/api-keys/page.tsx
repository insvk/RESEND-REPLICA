import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import styles from '../dashboard.module.css';
import { CreateKeyButton } from './CreateKeyButton';

export default async function ApiKeysPage() {
  const session = await getServerSession();
  
  // If not logged in, just fallback or redirect (in a real app, middleware handles this)
  if (!session?.user?.email) return <div>Please log in</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: { apiKeys: true }
      }
    }
  });

  const apiKeys = user?.projects[0]?.apiKeys || [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>API Keys</h1>
        <p className={styles.pageSubtitle}>Manage API keys to authenticate your requests.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <CreateKeyButton />
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Revoked</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No API keys found.
                </td>
              </tr>
            ) : (
              apiKeys.map(key => (
                <tr key={key.id}>
                  <td style={{ fontFamily: 'monospace' }}>{key.prefix}••••••••••••••••••••••••</td>
                  <td>{new Date(key.createdAt).toLocaleDateString()}</td>
                  <td>{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}</td>
                  <td>{key.revokedAt ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
