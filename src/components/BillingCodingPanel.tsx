import React, { useState } from 'react';
import { BillingSuggestions } from '../types';
import { Receipt, Copy, Check } from 'lucide-react';

interface BillingCodingPanelProps {
  billingSuggestions: BillingSuggestions;
}

export const BillingCodingPanel: React.FC<BillingCodingPanelProps> = ({ billingSuggestions }) => {
  const [copiedCodes, setCopiedCodes] = useState<boolean>(false);

  const icd10List = billingSuggestions?.icd_10_codes || [];
  const cptList = billingSuggestions?.cpt_codes || [];

  const handleCopyCodes = () => {
    const text = `MEDICAL BILLING & CODING SUGGESTIONS
ICD-10 CODES:
${icd10List.map((c) => `- ${c.code}: ${c.description} (Confidence: ${c.confidence})`).join('\n')}

CPT EVALUATION & MANAGEMENT CODES:
${cptList.map((c) => `- ${c.code}: ${c.description}\n  Rationale: ${c.rationale}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  return (
    <div id="billing-coding-card" className="vx-card p-5 overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[var(--vx-border)]">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-5 bg-[var(--vx-secondary)] rounded-xs shrink-0"></span>
          <div className="flex items-center space-x-2.5">
            <Receipt className="w-4 h-4 text-[var(--vx-secondary)]" />
            <h3 className="font-serif font-semibold text-sm text-[var(--vx-text)] flex items-center space-x-2">
              <span>Automated Billing & Coding Suggestions</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] border border-[var(--vx-border)]">
                ICD-10 & CPT
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={handleCopyCodes}
          className="vx-btn-ghost py-1.5 px-3 text-xs"
          title="Copy billing codes to clipboard"
        >
          {copiedCodes ? <Check className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--vx-text-muted)]" />}
          <span>{copiedCodes ? 'Copied' : 'Copy Codes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* ICD-10 Section */}
        <div className="space-y-2.5">
          <h4 className="font-mono text-xs text-[var(--vx-text-muted)] uppercase tracking-wider flex items-center justify-between font-semibold">
            <span>Suggested ICD-10 Diagnostic Codes</span>
            <span className="text-[var(--vx-text-subtle)] font-normal">({icd10List.length})</span>
          </h4>

          {icd10List.length > 0 ? (
            <div className="space-y-2">
              {icd10List.map((item, idx) => {
                const conf = item.confidence?.toLowerCase();
                return (
                  <div key={idx} className="bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="font-mono font-bold text-xs text-[var(--vx-primary)] bg-[var(--vx-primary-soft)] px-2 py-0.5 rounded-xs border border-[var(--vx-primary)]/20">
                        {item.code}
                      </span>
                      <p className="text-[var(--vx-text)] font-medium text-xs mt-1">{item.description}</p>
                    </div>
                    <span
                      className={`text-[9px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded-xs shrink-0 ${
                        conf === 'high'
                          ? 'bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border border-[var(--vx-primary)]/20'
                          : conf === 'medium'
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30'
                          : 'bg-[var(--vx-surface)] text-[var(--vx-text-muted)] border border-[var(--vx-border)]'
                      }`}
                    >
                      {item.confidence}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--vx-text-subtle)] italic bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] text-xs">
              No ICD-10 codes suggested.
            </p>
          )}
        </div>

        {/* CPT Section */}
        <div className="space-y-2.5">
          <h4 className="font-mono text-xs text-[var(--vx-text-muted)] uppercase tracking-wider flex items-center justify-between font-semibold">
            <span>CPT Evaluation & Management (E/M) Codes</span>
            <span className="text-[var(--vx-text-subtle)] font-normal">({cptList.length})</span>
          </h4>

          {cptList.length > 0 ? (
            <div className="space-y-2">
              {cptList.map((item, idx) => (
                <div key={idx} className="bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[var(--vx-secondary)] bg-[var(--vx-secondary-soft)] px-2 py-0.5 rounded-xs border border-[var(--vx-secondary)]/20">
                      {item.code}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--vx-text-subtle)] uppercase tracking-widest font-semibold">
                      E&M Level
                    </span>
                  </div>
                  <p className="text-[var(--vx-text)] font-medium text-xs">{item.description}</p>
                  {item.rationale && (
                    <p className="text-[var(--vx-text-muted)] text-[11px] font-normal italic bg-[var(--vx-surface)] p-2 rounded-xs border border-[var(--vx-border)] leading-relaxed">
                      Rationale: {item.rationale}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--vx-text-subtle)] italic bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] text-xs">
              No CPT codes suggested.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
