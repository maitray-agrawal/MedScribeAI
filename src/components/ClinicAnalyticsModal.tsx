import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { EncounterRecord } from '../types';
import { BarChart3, X, Clock, ShieldAlert, FileCheck, Award } from 'lucide-react';
import { useTranslation } from '../i18n';

interface ClinicAnalyticsModalProps {
  encounters: EncounterRecord[];
  onClose: () => void;
}

export const ClinicAnalyticsModal: React.FC<ClinicAnalyticsModalProps> = ({ encounters, onClose }) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>('button');
      if (closeBtn) closeBtn.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onClose]);

  const totalEncounters = encounters.length;

  // Calculate total minutes saved (averaging 12 mins per SOAP note if meta not available)
  const totalMinutesSaved = encounters.reduce((acc, curr) => {
    return acc + (curr.soapNote?.meta?.time_saved_estimate_minutes || 12);
  }, 0);

  const hoursSaved = (totalMinutesSaved / 60).toFixed(1);

  // Count safety alerts caught
  const totalAlertsIntercepted = encounters.reduce((acc, curr) => {
    return acc + (curr.soapNote?.safety_alerts?.length || 0);
  }, 0);

  // Frequency map of primary diagnoses
  const diagnosisMap: Record<string, number> = {};
  encounters.forEach((enc) => {
    const diag = enc.soapNote?.assessment?.primary_diagnosis || 'Unspecified';
    diagnosisMap[diag] = (diagnosisMap[diag] || 0) + 1;
  });

  const diagnosisList = Object.entries(diagnosisMap).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      id="analytics-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={modalRef}
        id="analytics-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="analytics-modal-title"
        tabIndex={-1}
        className="vx-card max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl focus:outline-none focus:ring-1 focus:ring-[var(--vx-primary)]"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.15 }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--vx-border)] flex items-center justify-between bg-[var(--vx-surface)]">
          <div className="flex items-center space-x-2.5">
            <BarChart3 className="w-4 h-4 text-[var(--vx-primary)]" />
            <h3 id="analytics-modal-title" className="font-serif font-semibold text-sm text-[var(--vx-text)]">
              {t.modals.analyticsTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label={t.modals.close}
            className="p-1.5 rounded-sm hover:bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] hover:text-[var(--vx-text)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs bg-[var(--vx-surface)] text-[var(--vx-text)]">
          {/* Top Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[var(--vx-surface-muted)] p-3.5 rounded-sm border border-[var(--vx-border)] flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xs bg-[var(--vx-surface)] border border-[var(--vx-border)] text-[var(--vx-primary)] flex items-center justify-center font-bold">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider">{t.modals.totalEncounters}</p>
                <p className="text-xl font-serif font-bold text-[var(--vx-text)]">{totalEncounters}</p>
              </div>
            </div>

            <div className="bg-[var(--vx-surface-muted)] p-3.5 rounded-sm border border-[var(--vx-border)] flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xs bg-[var(--vx-surface)] border border-[var(--vx-border)] text-[var(--vx-primary)] flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider">{t.modals.timeSaved}</p>
                <p className="text-xl font-serif font-bold text-[var(--vx-primary)]">
                  {hoursSaved} <span className="text-xs font-mono font-normal text-[var(--vx-text-muted)]">hrs</span>
                </p>
              </div>
            </div>

            <div className="bg-[var(--vx-surface-muted)] p-3.5 rounded-sm border border-[var(--vx-border)] flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xs bg-[var(--vx-surface)] border border-[var(--vx-border)] text-[var(--vx-secondary)] flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider">{t.modals.safetyAudited}</p>
                <p className="text-xl font-serif font-bold text-[var(--vx-secondary)]">{totalAlertsIntercepted}</p>
              </div>
            </div>
          </div>

          {/* Primary Diagnoses Breakdown */}
          <div className="bg-[var(--vx-surface-muted)] p-4 rounded-sm border border-[var(--vx-border)] space-y-3">
            <h4 className="font-serif font-semibold text-xs text-[var(--vx-text)] flex items-center justify-between uppercase tracking-wider">
              <span>Clinical Conditions Documented</span>
              <span className="text-[var(--vx-text-subtle)] text-[10px] font-mono font-normal">Encounter Distribution</span>
            </h4>

            {diagnosisList.length > 0 ? (
              <div className="space-y-2.5">
                {diagnosisList.slice(0, 6).map(([diag, count], idx) => {
                  const percentage = Math.round((count / Math.max(totalEncounters, 1)) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-[var(--vx-text)] truncate max-w-[280px]">{diag}</span>
                        <span className="text-[var(--vx-primary)] font-mono text-[11px] font-semibold">
                          {count} case{count > 1 ? 's' : ''} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--vx-surface)] rounded-xs overflow-hidden border border-[var(--vx-border)]">
                        <div
                          className="h-full bg-[var(--vx-primary)] rounded-xs transition-all"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[var(--vx-text-subtle)] italic text-xs">
                No encounter records saved yet to calculate diagnosis distribution.
              </p>
            )}
          </div>

          {/* Sovereignty & Impact Statement */}
          <div className="bg-[var(--vx-surface-muted)] p-4 rounded-sm border border-[var(--vx-border)] space-y-2 text-xs">
            <h4 className="font-serif font-semibold text-xs text-[var(--vx-secondary)] flex items-center space-x-1.5 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[var(--vx-secondary)]" />
              <span>Sovereign Clinical Intelligence Statement</span>
            </h4>
            <p className="text-[var(--vx-text-muted)] leading-relaxed text-xs">
              VAIDHYA combines sovereign mathematical precision, privacy-preserving clinical extraction, and real-time evidence grounding. In high-demand primary care environments, it reduces clinical documentation burden by up to 80% while keeping all inference under clinician oversight.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

