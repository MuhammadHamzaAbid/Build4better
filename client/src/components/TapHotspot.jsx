import React from 'react';

export default function TapHotspot({ target, onCorrectTap, hintLevel }) {
  if (!target) return null;

  const isHighlighted = hintLevel >= 3;

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label="Tap target area"
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
        borderRadius: 'var(--radius-lg)',
        border: isHighlighted ? '2.5px solid var(--primary)' : '2px solid transparent',
        backgroundColor: isHighlighted ? 'rgba(15, 94, 78, 0.12)' : 'transparent',
        animation: isHighlighted ? 'pulseHighlight 1.8s infinite' : 'none',
        outline: 'none',
        padding: 0
      }}
    />
  );
}
