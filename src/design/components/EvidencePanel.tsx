import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { AstraBindu } from './AstraBindu';
import { useTranslation } from '../../i18n';

export interface EvidenceItem {
  id: string;
  source: string;
  type: 'Chief Complaint' | 'Symptom' | 'Vital Sign' | 'Lab Result' | 'Medication' | 'Risk Factor';
  excerpt: string;
  confidence: number; // 0 - 100
  verificationState: 'verified' | 'physician-confirmed' | 'inferred';
  timestamp?: string;
  groundingReference?: string;
}

export interface EvidencePanelProps {
  evidenceItems: EvidenceItem[];
  className?: string;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceItems,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`vx-card p-5 space-y-4 ${className}`} id="evidence-grounding-panel">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--vx-border)]">
        <div className="flex items-center gap-2.5">
          <AstraBindu size={14} color="var(--vx-secondary)" />
          <div>
            <h3 className="font-editorial text-base font-semibold tracking-tight text-[var(--vx-text)]">
              {t.evidence.title}
            </h3>
            <span className="font-mono text-[11px] text-[var(--vx-text-muted)] block">
              {t.evidence.subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="vx-badge vx-badge-primary">
            <ShieldCheck className="w-3 h-3" />
            <span>{t.evidence.verifiedBadge}</span>
          </span>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {evidenceItems.map((item) => {
          const isHighConfidence = item.confidence >= 80;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)] bg-[var(--vx-surface-secondary)] hover:border-[var(--vx-secondary)] transition-all flex flex-col justify-between space-y-2.5 relative"
            >
              {/* Top metadata */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--vx-secondary)]">
                  {item.type}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Confidence pill */}
                  <span
                    className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded-[var(--vx-radius-xs)] ${
                      isHighConfidence
                        ? 'bg-[var(--vx-primary-soft)] text-[var(--vx-primary)]'
                        : 'bg-[var(--vx-warning-soft)] text-[var(--vx-warning)]'
                    }`}
                  >
                    {item.confidence}% CONFIDENCE
                  </span>

                  {/* Verification indicator */}
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--vx-primary)]" />
                </div>
              </div>

              {/* Verbatim Excerpt */}
              <blockquote className="font-sans text-xs text-[var(--vx-text)] italic border-l-2 border-[var(--vx-secondary)] pl-2.5 my-1 leading-relaxed">
                "{item.excerpt}"
              </blockquote>

              {/* Bottom metadata */}
              <div className="pt-2 border-t border-[var(--vx-border)] flex items-center justify-between text-[10px] font-mono text-[var(--vx-text-muted)]">
                <span>SRC: {item.source}</span>
                {item.groundingReference && (
                  <span className="text-[var(--vx-text-subtle)] truncate max-w-[140px]">
                    REF: {item.groundingReference}
                  </span>
                )}
                <span className="capitalize text-[var(--vx-primary)] font-medium">
                  ● {item.verificationState}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
