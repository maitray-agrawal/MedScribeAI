import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { EncounterRecord } from '../types';
import { History, X, Search, Trash2, ExternalLink, Calendar, FileText } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES_META } from '../i18n';

interface EncounterHistoryModalProps {
  encounters: EncounterRecord[];
  onLoadEncounter: (encounter: EncounterRecord) => void;
  onDeleteEncounter: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const EncounterHistoryModal: React.FC<EncounterHistoryModalProps> = ({
  encounters,
  onLoadEncounter,
  onDeleteEncounter,
  onClearAll,
  onClose,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap & Escape key listener
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
    // Auto-focus first input or modal on mount
    const timer = setTimeout(() => {
      const searchInput = modalRef.current?.querySelector<HTMLInputElement>('input');
      if (searchInput) searchInput.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onClose]);

  const filtered = encounters.filter((enc) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = enc.patientInfo?.name?.toLowerCase().includes(term);
    const diagMatch = enc.soapNote?.assessment?.primary_diagnosis?.toLowerCase().includes(term);
    const dateMatch = new Date(enc.timestamp).toLocaleDateString().includes(term);
    return nameMatch || diagMatch || dateMatch;
  });

  return (
    <motion.div
      id="encounter-history-overlay"
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
        id="encounter-history-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="encounter-history-title"
        tabIndex={-1}
        className="vx-card max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl focus:outline-none focus:ring-1 focus:ring-[var(--vx-primary)]"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.15 }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--vx-border)] flex items-center justify-between bg-[var(--vx-surface)]">
          <div className="flex items-center space-x-2.5">
            <History className="w-4 h-4 text-[var(--vx-primary)]" />
            <h3 id="encounter-history-title" className="font-serif font-semibold text-sm text-[var(--vx-text)]">
              {t.modals.historyTitle}
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border border-[var(--vx-primary)]/20">
              {encounters.length} Records
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label={t.modals.close}
            className="p-1.5 rounded-sm hover:bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] hover:text-[var(--vx-text)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-[var(--vx-surface-muted)] border-b border-[var(--vx-border)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[var(--vx-text-subtle)] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.modals.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm pl-8 pr-3 py-1.5 text-[var(--vx-text)] text-xs focus:outline-none focus:border-[var(--vx-primary)] transition-all font-mono placeholder:font-sans placeholder:text-[var(--vx-text-subtle)]"
            />
          </div>

          {encounters.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
            >
              {t.modals.clearAll}
            </button>
          )}
        </div>

        {/* Encounters List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[var(--vx-surface)]">
          {filtered.length > 0 ? (
            filtered.map((enc) => {
              const formattedDate = new Date(enc.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={enc.id}
                  className="bg-[var(--vx-surface-muted)] border border-[var(--vx-border)] hover:border-[var(--vx-border-strong)] rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-semibold text-sm text-[var(--vx-text)]">
                        {enc.patientInfo?.name || 'Unspecified Patient'}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--vx-primary)] bg-[var(--vx-primary-soft)] px-2 py-0.5 rounded-xs border border-[var(--vx-primary)]/20 font-semibold">
                        {enc.patientInfo?.age}y {enc.patientInfo?.sex}
                      </span>
                      {enc.language && (
                        <span className="text-[10px] font-mono text-[var(--vx-secondary)] bg-[var(--vx-surface)] px-1.5 py-0.5 rounded-xs border border-[var(--vx-border)] font-bold">
                          {SUPPORTED_LANGUAGES_META[enc.language]?.code || enc.language.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-[var(--vx-secondary)] font-medium text-xs">
                      Diagnosis: {enc.soapNote?.assessment?.primary_diagnosis || 'Unspecified'}
                    </p>

                    <div className="flex items-center space-x-3 text-[var(--vx-text-muted)] text-[11px] font-mono">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[var(--vx-text-subtle)]" />
                        <span>{formattedDate}</span>
                      </span>
                      <span>•</span>
                      <span>{enc.soapNote?.plan?.prescriptions?.length || 0} Rx</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => onLoadEncounter(enc)}
                      className="vx-btn-secondary py-1.5 px-3 text-xs flex items-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.modals.loadNote}</span>
                      <span className="sr-only">Load Note</span>
                    </button>

                    <button
                      onClick={() => onDeleteEncounter(enc.id)}
                      className="p-1.5 rounded-xs hover:bg-rose-500/10 text-[var(--vx-text-muted)] hover:text-rose-500 border border-[var(--vx-border)] cursor-pointer transition-colors"
                      title="Delete saved encounter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[var(--vx-text-muted)] space-y-2">
              <FileText className="w-8 h-8 text-[var(--vx-text-subtle)] mx-auto" />
              <p className="font-medium text-xs">{t.modals.noEncounters}</p>
              <p className="text-[11px] text-[var(--vx-text-subtle)]">
                Generated SOAP notes saved to your clinic device will appear here.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

