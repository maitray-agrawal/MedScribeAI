import React from 'react';

export interface VaidhyaMarkProps {
  size?: number;
  className?: string;
  variant?: 'primary' | 'dark' | 'monochrome' | 'sandstone' | 'auto';
  showGuideCircle?: boolean;
  animated?: boolean;
}

/**
 * VaidhyaMark — Official Clinical Intelligence Product Mark
 * Derived from AstraX Navadisha Mathematical Grammar
 * 
 * Anatomy:
 * - Central vertical axis with diamond nodes
 * - Central Copper Bindu (core clinical intelligence)
 * - Bilateral Forest Green leaf / care / clinical-flow wings
 * - Thin 1px construction guide geometry
 */
export const VaidhyaMark: React.FC<VaidhyaMarkProps> = ({
  size = 40,
  className = '',
  variant = 'auto',
  showGuideCircle = true,
  animated = false,
}) => {
  // Color tokens based on variant
  // 'auto' uses CSS variables so it shifts dynamically with the active theme!
  const leafColor = variant === 'auto' 
    ? 'var(--vx-primary)' 
    : variant === 'dark' 
      ? '#22C55E' 
      : variant === 'monochrome' 
        ? '#18181B' 
        : variant === 'sandstone' 
          ? '#B87333' 
          : '#166534';

  const binduColor = variant === 'auto' 
    ? 'var(--vx-secondary)' 
    : variant === 'dark' 
      ? '#D97706' 
      : variant === 'monochrome' 
        ? '#000000' 
        : variant === 'sandstone' 
          ? '#166534' 
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
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label="VAIDHYA Clinical Intelligence Mark"
      role="img"
    >
      {/* 1. Guide Circle (Dashed Mathematical Construction) */}
      {showGuideCircle && (
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke={axisColor}
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
      )}

      {/* 2. Vertical Axis Line */}
      <line
        x1="32"
        y1="6"
        x2="32"
        y2="58"
        stroke={axisColor}
        strokeWidth="1"
      />

      {/* 3. Top Axis Diamond Node */}
      <rect
        x="32"
        y="8"
        width="4"
        height="4"
        fill={binduColor}
        transform="rotate(45 32 8)"
      />

      {/* 4. Upper Sub-Node */}
      <rect
        x="32"
        y="18"
        width="3"
        height="3"
        fill={axisColor}
        transform="rotate(45 32 18)"
      />

      {/* 5. Left Organic Leaf / Care Wing */}
      <path
        d="M32 32 C26 24 16 20 12 28 C8 36 22 42 32 32 Z"
        fill={leafColor}
        className={animated ? 'transition-all duration-300' : ''}
      />
      {/* Left Wing Internal Spine */}
      <path
        d="M32 32 C23 27 16 26 12 28"
        stroke={axisColor}
        strokeWidth="0.75"
      />

      {/* 6. Right Organic Leaf / Care Wing */}
      <path
        d="M32 32 C38 24 48 20 52 28 C56 36 42 42 32 32 Z"
        fill={leafColor}
        className={animated ? 'transition-all duration-300' : ''}
      />
      {/* Right Wing Internal Spine */}
      <path
        d="M32 32 C41 27 48 26 52 28"
        stroke={axisColor}
        strokeWidth="0.75"
      />

      {/* 7. Central Bindu (Diamond Core Intelligence) */}
      <g className={animated ? 'animate-pulse' : ''}>
        {/* Outer Bindu Diamond */}
        <rect
          x="32"
          y="32"
          width="10"
          height="10"
          fill={binduColor}
          transform="rotate(45 32 32)"
        />
        {/* Inner Bindu Core */}
        <rect
          x="32"
          y="32"
          width="4"
          height="4"
          fill="var(--vx-surface)"
          transform="rotate(45 32 32)"
        />
      </g>

      {/* 8. Lower Sub-Node */}
      <rect
        x="32"
        y="46"
        width="3"
        height="3"
        fill={axisColor}
        transform="rotate(45 32 46)"
      />

      {/* 9. Bottom Axis Diamond Node */}
      <rect
        x="32"
        y="56"
        width="4"
        height="4"
        fill={binduColor}
        transform="rotate(45 32 56)"
      />
    </svg>
  );
};
