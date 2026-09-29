import React from 'react';
import {
  FileCheck,
  Edit2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Printer,
  Save,
  FileCode,
} from 'lucide-react';

import { DocumentationConfidence } from '../../types';
import { useTranslation, SupportedLanguage, SUPPORTED_LANGUAGES_META } from '../../i18n';
import { AstraBindu } from '../../design/components';

interface SOAPNoteHeaderProps {
  isEditing: boolean;
  copiedEHR: boolean;
  isReadingAloud: boolean;
  documentationConfidence?: DocumentationConfidence;
  isOfflineMode?: boolean;
  recordLanguage?: SupportedLanguage;
  onEdit: () => void;
  onSaveEdits: () => void;
  onCancelEdits: () => void;
  onCopyEHR: () => void;
  onReadAloud: () => void;
  onOpenPrintPrescription: () => void;
  onOpenFHIR?: () => void;
  onSaveEncounter: () => void;
}

export const SOAPNoteHeader: React.FC<SOAPNoteHeaderProps> = ({
  isEditing,
  copiedEHR,
  isReadingAloud,
  documentationConfidence,
  isOfflineMode = false,
  recordLanguage,
  onEdit,
  onSaveEdits,
  onCancelEdits,
  onCopyEHR,
  onReadAloud,
  onOpenPrintPrescription,
  onOpenFHIR,
  onSaveEncounter,
}) => {
  const { t } = useTranslation();
  const overallScore = documentationConfidence?.overall_score;

  return (
    <div id="soap-note-header" className="px-5 py-3.5 bg-[var(--vx-surface)] border-b border-[var(--vx-border)] flex flex-wrap items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-3">
        <AstraBindu size={14} color="var(--vx-primary)" />
        <div className="flex items-center gap-2 flex-wrap">
          <h2 id="soap-note-title" className="font-editorial text-sm sm:text-base font-semibold text-[var(--vx-text)] flex items-center gap-2">
            <span>{t.soapView.headerTitle}</span>
            <span className="vx-badge vx-badge-primary">
              {t.soapView.verifiedBadge}
            </span>
            {isOfflineMode && (
              <span id="badge-offline-engine" className="vx-badge vx-badge-copper">
                {t.soapView.offlineBadge}
              </span>
            )}
            {recordLanguage && (
              <span
                id="badge-soap-record-language"
                className="vx-badge vx-badge-copper font-mono text-[10px] tracking-wider"
                title={`${t.recordLanguage.recordLanguage}: ${SUPPORTED_LANGUAGES_META[recordLanguage]?.nativeName || recordLanguage}`}
              >
                {t.recordLanguage.badge} · {SUPPORTED_LANGUAGES_META[recordLanguage]?.nativeName.toUpperCase() || recordLanguage.toUpperCase()}
              </span>
            )}
            {overallScore !== undefined && (
              <span className={`px-2 py-0.5 rounded-[var(--vx-radius-xs)] font-mono text-[10px] font-bold border ${
                overallScore >= 85
                  ? 'bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border-[var(--vx-primary)]'
                  : overallScore >= 70
                  ? 'bg-[var(--vx-warning-soft)] text-[var(--vx-warning)] border-[var(--vx-warning)]'
                  : 'bg-[var(--vx-danger-soft)] text-[var(--vx-danger)] border-[var(--vx-danger)]'
              }`}>
                {t.soapView.overallSupport}: {overallScore}%
              </span>
            )}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* TTS Read Aloud */}
        <button
          id="btn-read-aloud"
          type="button"
          onClick={onReadAloud}
          className={`vx-btn-outline py-1 px-2.5 text-xs ${
            isReadingAloud ? 'text-[var(--vx-secondary)] border-[var(--vx-secondary)] bg-[var(--vx-secondary-soft)]' : ''
          }`}
          title={isReadingAloud ? t.soapView.stopSpeech : t.soapView.readAloud}
        >
          {isReadingAloud ? (
            <VolumeX className="w-3.5 h-3.5 text-[var(--vx-secondary)]" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />
          )}
          <span className="hidden sm:inline">
            {isReadingAloud ? t.soapView.stopSpeech : t.soapView.readAloud}
          </span>
        </button>

        {/* Copy EHR Text */}
        <button
          id="btn-copy-ehr"
          type="button"
          onClick={onCopyEHR}
          className="vx-btn-outline py-1 px-2.5 text-xs"
          title={t.soapView.copyEhr}
        >
          {copiedEHR ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--vx-primary)]" />
              <span className="text-[var(--vx-primary)] font-bold">{t.soapView.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />
              <span className="hidden sm:inline">{t.soapView.copyEhr}</span>
            </>
          )}
        </button>

        {/* Print Prescription */}
        <button
          id="btn-open-print-modal"
          type="button"
          onClick={onOpenPrintPrescription}
          className="vx-btn-outline py-1 px-2.5 text-xs"
          title={t.soapView.printRx}
        >
          <Printer className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />
          <span className="hidden sm:inline">{t.soapView.printRx}</span>
        </button>

        {/* FHIR R4 Export */}
        {onOpenFHIR && (
          <button
            id="btn-open-fhir-modal"
            type="button"
            onClick={onOpenFHIR}
            className="vx-btn-outline py-1 px-2.5 text-xs border-[var(--vx-border-accent)] text-[var(--vx-secondary)] hover:bg-[var(--vx-secondary-soft)]"
            title="Export to Interoperable FHIR R4 Bundle"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">FHIR R4</span>
          </button>
        )}

        {/* Edit or Save Edits */}
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <button
              id="btn-cancel-edits"
              type="button"
              onClick={onCancelEdits}
              className="vx-btn-outline py-1 px-2.5 text-xs"
            >
              {t.soapView.cancel}
            </button>
            <button
              id="btn-save-edits"
              type="button"
              onClick={onSaveEdits}
              className="vx-btn-primary py-1 px-3 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.soapView.doneEditing}</span>
            </button>
          </div>
        ) : (
          <button
            id="btn-edit-soap"
            type="button"
            onClick={onEdit}
            className="vx-btn-outline py-1 px-2.5 text-xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />
            <span>{t.soapView.editNote}</span>
          </button>
        )}

        {/* Finalize & Save Encounter */}
        <button
          id="btn-save-encounter"
          type="button"
          onClick={onSaveEncounter}
          className="vx-btn-primary py-1 px-3.5 text-xs ml-1"
          title="Save finalized encounter to clinic offline history"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.soapView.saveRecord}</span>
        </button>
      </div>
    </div>
  );
};
