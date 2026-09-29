import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Download, Check, FileCode, ShieldCheck } from 'lucide-react';
import { PatientInfo, SOAPNote } from '../../types';
import { exportToFHIRBundle, FHIRBundle } from '../../utils/fhirConverter';

interface FHIRExportModalProps {
  patientInfo: PatientInfo;
  soapNote: SOAPNote;
  onClose: () => void;
}

export const FHIRExportModal: React.FC<FHIRExportModalProps> = ({ patientInfo, soapNote, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [fhirBundle, setFhirBundle] = useState<FHIRBundle | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bundle = exportToFHIRBundle(patientInfo, soapNote);
    setFhirBundle(bundle);
  }, [patientInfo, soapNote]);

  // Keyboard trap & Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const jsonString = fhirBundle ? JSON.stringify(fhirBundle, null, 2) : '';

  const handleCopy = async () => {
    if (!jsonString) return;
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonString) return;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (patientInfo.name || 'patient').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.href = url;
    a.download = `fhir_bundle_${safeName}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fhir-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="vx-card max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl focus:outline-none focus:ring-1 focus:ring-[var(--vx-primary)]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--vx-border)] flex items-center justify-between bg-[var(--vx-surface)]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xs bg-[var(--vx-primary-soft)] border border-[var(--vx-primary)]/20 flex items-center justify-center text-[var(--vx-primary)]">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="fhir-modal-title" className="font-serif font-semibold text-base text-[var(--vx-text)]">
                  HL7 FHIR R4 Bundle Export
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider font-semibold bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border border-[var(--vx-primary)]/20 px-2 py-0.5 rounded-xs">
                  <ShieldCheck className="w-3 h-3" /> Standard R4 Bundle
                </span>
              </div>
              <p className="text-xs text-[var(--vx-text-muted)] mt-0.5">
                Interoperable clinical JSON bundle structured for sovereign health information exchanges and ABDM/EHR ingest.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-sm hover:bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] hover:text-[var(--vx-text)] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - JSON Preview */}
        <div className="p-5 flex-1 overflow-y-auto bg-[var(--vx-surface-muted)] text-[var(--vx-text)] font-mono text-xs leading-relaxed space-y-3">
          <div className="flex items-center justify-between text-[var(--vx-text-subtle)] text-[10px] uppercase font-mono tracking-wider border-b border-[var(--vx-border)] pb-2">
            <span>resourceType: "Bundle" (collection)</span>
            <span>{fhirBundle?.entry?.length || 0} FHIR Resources</span>
          </div>
          <pre className="whitespace-pre-wrap break-words">{jsonString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--vx-border)] bg-[var(--vx-surface)] flex items-center justify-between">
          <p className="text-[11px] text-[var(--vx-text-muted)] font-medium">
            Contains Patient, Encounter, Condition (ICD-10), MedicationRequest, and Composition resources.
          </p>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleCopy}
              className="vx-btn-ghost py-1.5 px-3 text-xs flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="vx-btn-primary py-1.5 px-3 text-xs flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bundle</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
