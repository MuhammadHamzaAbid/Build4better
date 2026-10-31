import React, { useState, useRef } from 'react';

export default function HotspotEditor({ imageSrc, value = { x: 10, y: 50, w: 80, h: 12 }, onChange }) {
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const getPercentCoords = (clientX, clientY) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  };

  const handleMouseDown = (e) => {
    const pos = getPercentCoords(e.clientX, e.clientY);
    setStartPos(pos);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const current = getPercentCoords(e.clientX, e.clientY);
    const x = Math.min(startPos.x, current.x);
    const y = Math.min(startPos.y, current.y);
    const w = Number(Math.abs(current.x - startPos.x).toFixed(1));
    const h = Number(Math.abs(current.y - startPos.y).toFixed(1));
    onChange({ x, y, w, h });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        fontSize: '14px'
      }}>
        <span>
          Target: <strong>x: {value.x}%, y: {value.y}%, w: {value.w}%, h: {value.h}%</strong>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: '4px 10px',
            backgroundColor: copied ? 'var(--primary-soft)' : 'var(--surface)',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: 'relative',
          width: '100%',
          userSelect: 'none',
          cursor: 'crosshair',
          border: '2px solid var(--primary)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <img
          src={imageSrc}
          alt="Mock Screen for Hotspot editing"
          style={{ width: '100%', display: 'block', pointerEvents: 'none' }}
        />

        {/* Drawn Hotspot Box */}
        <div
          style={{
            position: 'absolute',
            left: `${value.x}%`,
            top: `${value.y}%`,
            width: `${value.w}%`,
            height: `${value.h}%`,
            border: '3px solid var(--primary)',
            backgroundColor: 'rgba(15, 110, 90, 0.25)',
            boxSizing: 'border-box',
            pointerEvents: 'none'
          }}
        />
      </div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
        👆 Drag to draw tap area over the image
      </p>
    </div>
  );
}
