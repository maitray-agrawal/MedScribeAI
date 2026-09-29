import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SOAPNote, PatientInfo } from '../types';
import { Printer, X } from 'lucide-react';
import { VaidhyaMark } from '../design/components/VaidhyaMark';

interface PrintPrescriptionModalProps {
  patientInfo: PatientInfo;
  soapNote: SOAPNote;
  onClose: () => void;
}

export const PrintPrescriptionModal: React.FC<PrintPrescriptionModalProps> = ({
  patientInfo,
  soapNote,
  onClose,
}) => {
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
      const printBtn = modalRef.current?.querySelector<HTMLButtonElement>('button');
      if (printBtn) printBtn.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      id="print-prescription-overlay"
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
        id="print-prescription-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-prescription-title"
        tabIndex={-1}
        className="vx-card max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl focus:outline-none focus:ring-1 focus:ring-[var(--vx-primary)]"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.15 }}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--vx-border)] flex items-center justify-between bg-[var(--vx-surface)]">
          <div className="flex items-center space-x-2.5">
            <Printer className="w-4 h-4 text-[var(--vx-primary)]" />
            <h3 id="print-prescription-title" className="font-serif font-semibold text-sm text-[var(--vx-text)]">
              Print Patient Prescription & Advice Slip
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="vx-btn-primary py-1.5 px-3 text-xs flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Record</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-sm hover:bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] hover:text-[var(--vx-text)] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet Container */}
        <div className="p-6 overflow-y-auto bg-[var(--vx-surface)] text-[var(--vx-text)] space-y-5 print-container text-xs print:bg-white print:text-black">
          {/* Printable Sheet Header */}
          <div className="border-b border-[var(--vx-border)] pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start space-x-3">
              <VaidhyaMark size={40} />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif font-bold text-base text-[var(--vx-text)] tracking-tight print:text-black">
                    VAIDHYA
                  </h2>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--vx-primary)] border border-[var(--vx-primary)]/30 px-1.5 py-0.2 rounded-xs">
                    CLINICAL INTELLIGENCE
                  </span>
                </div>
                <p className="text-[var(--vx-text-muted)] text-xs font-medium mt-0.5 print:text-gray-600">
                  {patientInfo.clinicLocation || 'Outpatient Clinical Consultation Unit'}
                </p>
                <p className="text-[var(--vx-text-subtle)] text-[10px] font-mono tracking-wider print:text-gray-500">
                  MEMBER OF THE ASTRAX FAMILY
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-[var(--vx-text-muted)] font-mono">
              <p className="font-semibold text-[var(--vx-text)] print:text-black">Date: {currentDate}</p>
              <p className="text-[10px] text-[var(--vx-text-subtle)] mt-0.5">
                ENCOUNTER ID: VX-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="bg-[var(--vx-surface-muted)] p-3.5 rounded-sm border border-[var(--vx-border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="text-[var(--vx-text-subtle)] block text-[10px] font-mono uppercase tracking-wider font-semibold">
                Patient Name:
              </span>
              <span className="font-semibold text-[var(--vx-text)] print:text-black">{patientInfo.name || 'Unspecified'}</span>
            </div>
            <div>
              <span className="text-[var(--vx-text-subtle)] block text-[10px] font-mono uppercase tracking-wider font-semibold">
                Age / Sex:
              </span>
              <span className="text-[var(--vx-text)] print:text-black">{patientInfo.age} yrs ({patientInfo.sex})</span>
            </div>
            <div>
              <span className="text-[var(--vx-text-subtle)] block text-[10px] font-mono uppercase tracking-wider font-semibold">
                Known Allergies:
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold print:text-red-700">
                {patientInfo.knownAllergies || 'NKDA'}
              </span>
            </div>
            <div>
              <span className="text-[var(--vx-text-subtle)] block text-[10px] font-mono uppercase tracking-wider font-semibold">
                Diagnosis:
              </span>
              <span className="text-[var(--vx-primary)] font-bold print:text-black">
                {soapNote.assessment.primary_diagnosis || 'Primary Care Consultation'}
              </span>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-xs text-[var(--vx-text)] uppercase tracking-wider flex items-center space-x-2 border-b border-[var(--vx-border)] pb-1.5">
              <span className="text-sm font-serif italic text-[var(--vx-secondary)]">Rx</span>
              <span>Prescribed Medications & Posology</span>
            </h4>

            {soapNote.plan.prescriptions?.length > 0 ? (
              <div className="space-y-2">
                {soapNote.plan.prescriptions.map((rx, idx) => (
                  <div key={idx} className="bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] flex items-start justify-between print:bg-white print:border-gray-300">
                    <div>
                      <p className="font-semibold text-[var(--vx-primary)] text-xs print:text-black">
                        {idx + 1}. {rx.medication} <span className="text-[var(--vx-text-muted)] font-normal">({rx.dosage})</span>
                      </p>
                      <p className="text-[var(--vx-text)] text-xs mt-0.5 font-medium">Take {rx.frequency}</p>
                      {rx.instructions && (
                        <p className="text-[var(--vx-text-muted)] italic text-[11px] mt-0.5">Instructions: {rx.instructions}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--vx-text-subtle)] italic p-3 bg-[var(--vx-surface-muted)] rounded-sm border border-[var(--vx-border)] text-xs">
                No oral or topical prescriptions ordered.
              </p>
            )}
          </div>

          {/* Patient Instructions */}
          <div className="space-y-1.5">
            <h4 className="font-serif font-semibold text-xs text-[var(--vx-text)] uppercase tracking-wider border-b border-[var(--vx-border)] pb-1">
              Patient Care & Clinical Advice
            </h4>
            <p className="text-[var(--vx-text)] bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] leading-relaxed text-xs print:bg-white print:border-gray-300">
              {soapNote.plan.patient_education || 'Please take medications as instructed and maintain adequate hydration.'}
            </p>
          </div>

          {/* Follow-up & Doctor Signature Box */}
          <div className="pt-4 border-t border-[var(--vx-border)] flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div>
              <span className="text-[var(--vx-text-subtle)] text-[10px] font-mono uppercase tracking-wider block font-semibold">
                Follow-up Schedule:
              </span>
              <span className="text-[var(--vx-secondary)] font-semibold text-xs mt-0.5 block print:text-black">
                {soapNote.plan.follow_up || 'Return as needed'}
              </span>
            </div>

            <div className="text-right space-y-1">
              <div className="w-48 h-8 border-b border-[var(--vx-border-strong)] border-dashed"></div>
              <p className="font-semibold text-[var(--vx-text)] text-xs print:text-black">Attending Clinician Signature</p>
              <p className="text-[var(--vx-text-subtle)] text-[10px] font-mono tracking-wider">
                VAIDHYA Sovereign Clinical Intelligence · Physician Approved
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

