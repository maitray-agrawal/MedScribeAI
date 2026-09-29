import React from 'react';
import { AstraMark } from './AstraMark';

export interface AstraAttributionProps {
  onClick?: () => void;
  className?: string;
  variant?: 'pill' | 'footer' | 'minimal';
}

export const AstraAttribution: React.FC<AstraAttributionProps> = ({
  onClick,
  className = '',
  variant = 'pill',
}) => {
  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[var(--vx-text-muted)] hover:text-[var(--vx-secondary)] transition-colors cursor-pointer ${className}`}
        title="Explore AstraX Intelligence Systems"
      >
        <AstraMark size={14} showGuideCircle={false} />
        <span>MEMBER OF THE ASTRAX FAMILY</span>
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--vx-text-muted)] font-mono ${className}`}>
        <div className="flex items-center gap-2">
          <AstraMark size={18} showGuideCircle={false} />
          <span className="tracking-wider">VAIDHYA · CLINICAL INTELLIGENCE</span>
          <span className="text-[var(--vx-border-strong)]">|</span>
          <button
            type="button"
            onClick={onClick}
            className="hover:text-[var(--vx-secondary)] underline decoration-dotted transition-colors cursor-pointer"
          >
            MEMBER OF THE ASTRAX FAMILY
          </button>
        </div>
        <p className="text-[11px] text-[var(--vx-text-subtle)]">
          Intelligence, Built on Indian Mathematical Grammar
        </p>
      </div>
    );
  }

  // Pill variant for Header
  return (
    <button
      id="btn-astrax-family"
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--vx-radius-full)] bg-[var(--vx-surface-muted)] hover:bg-[var(--vx-surface-elevated)] border border-[var(--vx-border)] hover:border-[var(--vx-border-accent)] transition-all cursor-pointer select-none group text-left ${className}`}
      title="View AstraX Family & Mathematical Grammar"
    >
      <AstraMark size={15} showGuideCircle={false} className="group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vx-text-secondary)] group-hover:text-[var(--vx-secondary)] font-semibold">
        AstraX Family
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--vx-secondary)] opacity-70 group-hover:opacity-100" />
    </button>
  );
};
