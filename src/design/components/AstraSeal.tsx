import React from 'react';

export interface AstraSealProps {
  size?: number;
  className?: string;
  theme?: string;
}

export const AstraSeal: React.FC<AstraSealProps> = ({
  size = 80,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="AstraX Seal of Intelligence"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        className="w-full h-full"
      >
        <defs>
          <path
            id="astraSealCircleTop"
            d="M 20,80 A 60,60 0 1,1 140,80"
            fill="none"
          />
          <path
            id="astraSealCircleBottom"
            d="M 140,80 A 60,60 0 0,1 20,80"
            fill="none"
          />
        </defs>

        {/* Double Outer Rings */}
        <circle
          cx="80"
          cy="80"
          r="74"
          stroke="var(--vx-secondary)"
          strokeWidth="1.25"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="var(--vx-border-strong)"
          strokeWidth="0.75"
          strokeDasharray="3 3"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="48"
          stroke="var(--vx-border)"
          strokeWidth="0.75"
          fill="none"
        />

        {/* Curved Circular Text */}
        <text
          fill="var(--vx-text-secondary)"
          fontSize="8.5"
          fontFamily="var(--font-mono)"
          letterSpacing="0.22em"
          fontWeight="600"
        >
          <textPath href="#astraSealCircleTop" startOffset="50%" textAnchor="middle">
            ASTRAX SOVEREIGN
          </textPath>
        </text>

        <text
          fill="var(--vx-text-muted)"
          fontSize="7.5"
          fontFamily="var(--font-mono)"
          letterSpacing="0.18em"
          fontWeight="500"
        >
          <textPath href="#astraSealCircleBottom" startOffset="50%" textAnchor="middle">
            CLINICAL INTELLIGENCE
          </textPath>
        </text>

        {/* Center Diamond Nodes */}
        <rect
          x="80"
          y="80"
          width="14"
          height="14"
          fill="var(--vx-primary)"
          transform="rotate(45 80 80)"
        />
        <rect
          x="80"
          y="80"
          width="6"
          height="6"
          fill="var(--vx-surface)"
          transform="rotate(45 80 80)"
        />

        {/* Ticks */}
        <line x1="80" y1="22" x2="80" y2="28" stroke="var(--vx-secondary)" strokeWidth="1" />
        <line x1="80" y1="132" x2="80" y2="138" stroke="var(--vx-secondary)" strokeWidth="1" />
        <line x1="22" y1="80" x2="28" y2="80" stroke="var(--vx-secondary)" strokeWidth="1" />
        <line x1="132" y1="80" x2="138" y2="80" stroke="var(--vx-secondary)" strokeWidth="1" />
      </svg>
    </div>
  );
};
