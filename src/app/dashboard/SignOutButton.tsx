'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{
        width: '100%',
        padding: '0.75rem',
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        cursor: 'pointer',
        textAlign: 'center',
        marginTop: '1rem',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      Sign Out
    </button>
  );
}
