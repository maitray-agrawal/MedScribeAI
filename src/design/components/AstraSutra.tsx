import React from 'react';
import { useTranslation } from '../../i18n';

export type ClinicalStage = 'intake' | 'transcription' | 'structuring' | 'evidence' | 'review' | 'approval';

export interface AstraSutraProps {
  currentStage: ClinicalStage;
  onSelectStage?: (stage: ClinicalStage) => void;
  className?: string;
}

export const AstraSutra: React.FC<AstraSutraProps> = ({
  currentStage,
  onSelectStage,
  className = '',
}) => {
  const { t } = useTranslation();

  const STAGES: { id: ClinicalStage; label: string; code: string }[] = [
    { id: 'intake', label: t.workflow.intake, code: '01' },
    { id: 'transcription', label: t.workflow.transcription, code: '02' },
    { id: 'structuring', label: t.workflow.structuring, code: '03' },
    { id: 'evidence', label: t.workflow.evidence, code: '04' },
    { id: 'review', label: t.workflow.review, code: '05' },
    { id: 'approval', label: t.workflow.approval, code: '06' },
  ];

  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <nav
      aria-label="Clinical Workflow Progression"
      className={`w-full py-2 px-3 sm:px-4 vx-card overflow-x-auto select-none ${className}`}
    >
      <div className="flex items-center justify-between min-w-[580px] relative py-1">
        {/* Continuous Construction Sutra Line */}
        <div className="absolute left-6 right-6 top-4 h-[1.5px] bg-[var(--vx-border)] z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute left-6 top-4 h-[2px] bg-[var(--vx-primary)] z-0 transition-all duration-300"
          style={{
            width: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
          }}
        />

        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage?.(stage.id)}
              aria-current={isCurrent ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vx-focus)] rounded-[var(--vx-radius-xs)] px-1"
            >
              {/* AstraX Diamond Node */}
              <div
                className={`w-5 h-5 rotate-45 flex items-center justify-center transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[var(--vx-primary)] ring-3 ring-[var(--vx-primary-soft)] scale-110 shadow-xs'
                    : isPassed
                      ? 'bg-[var(--vx-secondary)] shadow-2xs'
                      : 'bg-[var(--vx-surface)] border border-[var(--vx-border-strong)]'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rotate-45 ${
                    isCurrent || isPassed ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Stage Metadata & Localized Label */}
              <div className="text-center mt-0.5">
                <span className="block text-[9px] font-mono tracking-wider text-[var(--vx-text-subtle)] font-medium">
                  {t.workflow.stage} {stage.code}
                </span>
                <span
                  className={`text-[11px] font-medium tracking-tight block truncate max-w-[110px] ${
                    isCurrent
                      ? 'text-[var(--vx-primary)] font-bold'
                      : isPassed
                        ? 'text-[var(--vx-text)]'
                        : 'text-[var(--vx-text-muted)]'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
