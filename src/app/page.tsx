import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={`${styles.headerContent} container`}>
          <div className={styles.logo}>
            Resend Replica
          </div>
          <nav className={styles.nav}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/register" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sign Up</Link>
          </nav>
        </div>
      </header>

      <div className={`${styles.content} container`}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Transactional Email <br />
            <span className="gradient-text">Built for Developers</span>
          </h1>
          <p className={styles.description}>
            The production-grade, self-hosted transactional email platform. 
            Reliable, fast, and beautifully designed.
          </p>
          <div className={styles.actions}>
            <Link href="/dashboard" className={`${styles.button} ${styles.buttonPrimary}`}>
              Get Started
            </Link>
            <Link href="/docs" className={`${styles.button} ${styles.buttonSecondary}`}>
              Read the docs
            </Link>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          <div className={`${styles.card} glass-panel`}>
            <h3 className={styles.cardTitle}>Emails Sent</h3>
            <div className={styles.cardValue}>1,245</div>
            <p className={styles.cardDesc}>Last 30 days</p>
          </div>
          <div className={`${styles.card} glass-panel`}>
            <h3 className={styles.cardTitle}>Delivery Rate</h3>
            <div className={styles.cardValue}>99.8%</div>
            <p className={styles.cardDesc}>Industry leading deliverability</p>
          </div>
          <div className={`${styles.card} glass-panel`}>
            <h3 className={styles.cardTitle}>Bounces</h3>
            <div className={styles.cardValue}>3</div>
            <p className={styles.cardDesc}>0.24% bounce rate</p>
          </div>
        </div>
      </div>
    </main>
  );
}
