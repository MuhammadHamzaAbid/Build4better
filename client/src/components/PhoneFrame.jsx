import React from 'react';

export default function PhoneFrame({ children }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
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
