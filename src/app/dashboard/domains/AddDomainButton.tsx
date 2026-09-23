'use client';

import { useState } from 'react';
import { createDomain } from '../actions';

export function AddDomainButton() {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const domainName = prompt("Enter the domain you want to verify (e.g. yourcompany.com):");
    if (!domainName) return;

    setLoading(true);
    try {
      await createDomain(domainName);
      alert('Domain added successfully! DNS records generated.');
    } catch (e: any) {
      alert(e.message || 'Failed to add domain');
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--text-primary)',
        color: 'var(--bg-primary)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? 'Adding...' : 'Add Domain'}
    </button>
  );
}
