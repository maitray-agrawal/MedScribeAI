import React from 'react';

export interface AstraBinduProps {
  size?: number;
  className?: string;
  pulse?: boolean;
  color?: string;
}

/**
 * AstraBindu — The mathematical origin node (18x18 diamond core)
 */
export const AstraBindu: React.FC<AstraBinduProps> = ({
  size = 18,
  className = '',
  pulse = false,
  color = 'var(--vx-secondary)',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {pulse && (
        <span
          className="absolute inset-0 rotate-45 rounded-[2px] opacity-40 animate-ping"
          style={{ backgroundColor: color }}
        />
      )}
      <div
        className="w-full h-full rotate-45 rounded-[1.5px] shadow-xs flex items-center justify-center transition-transform hover:scale-110"
        style={{ backgroundColor: color }}
      >
        <div
          className="w-1/3 h-1/3 rotate-45 rounded-[0.5px]"
          style={{ backgroundColor: 'var(--vx-surface)' }}
        />
      </div>
    </div>
  );
};
