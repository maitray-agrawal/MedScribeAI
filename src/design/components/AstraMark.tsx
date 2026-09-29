import React from 'react';

export interface AstraMarkProps {
  size?: number;
  className?: string;
  variant?: 'primary' | 'dark' | 'monochrome' | 'sandstone' | 'auto';
  showGuideCircle?: boolean;
}

/**
 * AstraMark — Master Institutional AstraX Symbol
 * Based on 9/108 Navadisha Indian Mathematical Grammar
 */
export const AstraMark: React.FC<AstraMarkProps> = ({
  size = 40,
  className = '',
  variant = 'auto',
  showGuideCircle = true,
}) => {
  const armColor1 = variant === 'auto'
    ? 'var(--astra-indigo)'
    : variant === 'dark'
      ? '#2563EB'
      : variant === 'monochrome'
        ? '#18181B'
        : '#1E3A8A';

  const armColor2 = variant === 'auto'
    ? 'var(--astra-copper)'
    : variant === 'dark'
      ? '#D97706'
      : variant === 'monochrome'
        ? '#52525B'
        : '#B87333';

  const binduColor = variant === 'auto'
    ? 'var(--astra-copper)'
    : variant === 'dark'
      ? '#F59E0B'
      : variant === 'monochrome'
        ? '#000000'
        : '#B87333';

  const axisColor = variant === 'auto'
    ? 'var(--vx-border-strong)'
    : variant === 'dark'
      ? 'rgba(253, 247, 236, 0.25)'
      : variant === 'monochrome'
        ? 'rgba(0, 0, 0, 0.25)'
        : 'rgba(34, 27, 20, 0.25)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label="AstraX Institutional Emblem"
      role="img"
    >
      {/* Guide Circle */}
      {showGuideCircle && (
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke={axisColor}
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
      )}

      {/* Vertical Axis */}
      <line x1="50" y1="8" x2="50" y2="92" stroke={axisColor} strokeWidth="1" />
      {/* Horizontal Axis */}
      <line x1="8" y1="50" x2="92" stroke={axisColor} strokeWidth="1" />

      {/* Axis Diamond Nodes */}
      <rect x="50" y="10" width="5" height="5" fill={binduColor} transform="rotate(45 50 10)" />
      <rect x="50" y="24" width="3" height="3" fill={axisColor} transform="rotate(45 50 24)" />
      <rect x="50" y="76" width="3" height="3" fill={axisColor} transform="rotate(45 50 76)" />
      <rect x="50" y="90" width="5" height="5" fill={binduColor} transform="rotate(45 50 90)" />

      <rect x="10" y="50" width="5" height="5" fill={binduColor} transform="rotate(45 10 50)" />
      <rect x="90" y="50" width="5" height="5" fill={binduColor} transform="rotate(45 90 50)" />

      {/* Four Curved Mathematical Horns / Crescent Strokes */}
      {/* Left Inward Crescent (Indigo) */}
      <path
        d="M20 20 C42 42 42 58 20 80 C36 68 44 58 44 50 C44 42 36 32 20 20 Z"
        fill={armColor1}
      />
      {/* Right Inward Crescent (Copper) */}
      <path
        d="M80 20 C58 42 58 58 80 80 C64 68 56 58 56 50 C56 42 64 32 80 20 Z"
        fill={armColor2}
      />

      {/* Central Diamond Bindu Core */}
      <rect
        x="50"
        y="50"
        width="14"
        height="14"
        fill={binduColor}
        transform="rotate(45 50 50)"
      />
      <rect
        x="50"
        y="50"
        width="6"
        height="6"
        fill="var(--vx-surface)"
        transform="rotate(45 50 50)"
      />
    </svg>
  );
};
