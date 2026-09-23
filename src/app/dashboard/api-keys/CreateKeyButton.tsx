'use client';

import { useState } from 'react';
import { createApiKey } from '../actions';

export function CreateKeyButton() {
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const result = await createApiKey();
      setNewKey(result.apiKey);
    } catch (e: any) {
      alert(e.message || 'Failed to create API key');
    }
    setLoading(false);
  };

  return (
    <div>
      <button 
        onClick={handleCreate}
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
        {loading ? 'Creating...' : 'Create API Key'}
      </button>

      {newKey && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 500 }}>API Key Created Successfully!</p>
          <code style={{ 
            display: 'block', 
            padding: '0.75rem', 
            background: 'var(--bg-elevated)', 
            borderRadius: '4px',
            userSelect: 'all'
          }}>
            {newKey}
          </code>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Please copy this key immediately. You will not be able to see it again.
          </p>
        </div>
      )}
    </div>
  );
}
