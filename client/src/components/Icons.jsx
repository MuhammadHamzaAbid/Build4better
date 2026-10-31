import React from 'react';

const defaultProps = {
  width: 20,
  height: 20,
  strokeWidth: 2,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconBook({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h7" />
    </svg>
  );
}

export function IconShield({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconShieldAlert({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function IconSearch({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function IconVolume({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function IconVolumePlaying({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15 9l4 6" />
      <path d="M19 9l-4 6" />
    </svg>
  );
}

export function IconLightbulb({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

export function IconCheck({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconCheckCircle({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function IconUndo({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

export function IconRotate({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export function IconArrowRight({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function IconArrowLeft({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function IconHome({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function IconUsers({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconPencil({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function IconAlertTriangle({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function IconPhoneCall({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function IconDownload({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function IconSparkles({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  );
}

export function IconHelpCircle({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function IconMessageSquare({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IconSend({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function IconX({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
