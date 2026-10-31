import React from 'react';

export default function PhoneFrame({ children }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      boxShadow: '0 4px 20px rgba(23, 26, 28, 0.08), 0 1px 3px rgba(23, 26, 28, 0.04)',
      borderLeft: '1px solid var(--border)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      margin: '0 auto',
      overflowX: 'hidden'
    }}>
      {children}
    </div>
  );
}
