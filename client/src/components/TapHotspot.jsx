import React from 'react';

export default function TapHotspot({ target, onCorrectTap, hintLevel }) {
  if (!target) return null;

  const isHighlighted = hintLevel >= 3;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onCorrectTap();
      }}
      style={{
        position: 'absolute',
        left: `${target.x}%`,
        top: `${target.y}%`,
        width: `${target.w}%`,
        height: `${target.h}%`,
        cursor: 'pointer',
        zIndex: 10,
        borderRadius: '16px',
        border: isHighlighted ? '3px solid var(--primary)' : '2px dashed transparent',
        backgroundColor: isHighlighted ? 'rgba(15, 110, 90, 0.15)' : 'transparent',
        animation: isHighlighted ? 'pulseGlow 1.8s infinite' : 'none',
        transition: 'all 0.3s ease'
      }}
      title={isHighlighted ? 'Yahan tap karein' : ''}
    />
  );
}
