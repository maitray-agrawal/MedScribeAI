import React from 'react';
import { Assessment, SectionDocumentationScore } from '../../types';
import { ChevronRight } from 'lucide-react';
import { DocumentationConfidenceBadge } from './DocumentationConfidenceBadge';

interface AssessmentSectionProps {
  assessment: Assessment;
  confidence?: SectionDocumentationScore;
  isEditing: boolean;
  onChange: (updatedAssessment: Assessment) => void;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  assessment,
  confidence,
  isEditing,
  onChange,
}) => {
  return (
    <div id="soap-section-assessment" className="vx-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--vx-border)] pb-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-5 bg-[var(--vx-secondary)] rounded-xs shrink-0"></span>
          <h3 className="font-serif font-semibold text-[var(--vx-text)] tracking-wide text-xs uppercase flex items-center space-x-2">
            <span>Assessment (A)</span>
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <DocumentationConfidenceBadge sectionName="Assessment (A)" confidence={confidence} />
          <span className="text-[10px] uppercase font-mono font-medium tracking-wider px-2 py-0.5 rounded-sm bg-[var(--vx-secondary-soft)] text-[var(--vx-secondary)] border border-[var(--vx-secondary)]/20">
            Diagnosis & Evaluation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3.5">
          <div>
            <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
              Primary Diagnosis:
            </label>
            {isEditing ? (
              <input
                type="text"
                value={assessment.primary_diagnosis}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    primary_diagnosis: e.target.value,
                  })
                }
                className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2.5 text-[var(--vx-text)] text-xs font-semibold focus:border-[var(--vx-primary)] focus:outline-none"
              />
            ) : (
              <div className="bg-[var(--vx-surface-muted)] border border-[var(--vx-secondary)]/30 text-[var(--vx-text)] font-semibold p-3.5 rounded-sm text-sm flex items-center justify-between">
                <span className="text-base font-serif">{assessment.primary_diagnosis || 'Unspecified'}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 bg-[var(--vx-secondary)] text-white rounded-xs">
                  Working Impression
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
              Clinical Synthesis Summary:
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={assessment.clinical_summary}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    clinical_summary: e.target.value,
                  })
                }
                className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2.5 text-[var(--vx-text)] text-xs focus:border-[var(--vx-primary)] focus:outline-none"
              />
            ) : (
              <p className="text-[var(--vx-text)] font-normal bg-[var(--vx-surface-muted)] p-3.5 rounded-sm border border-[var(--vx-border)] leading-relaxed text-xs">
                {assessment.clinical_summary || 'No clinical summary provided.'}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Differential Diagnoses:
          </label>
          {assessment.differential_diagnoses?.length > 0 ? (
            <ul className="space-y-2">
              {assessment.differential_diagnoses.map((diff, idx) => (
                <li
                  key={idx}
                  className="bg-[var(--vx-surface-muted)] p-2.5 rounded-sm border border-[var(--vx-border)] text-[var(--vx-text)] font-medium text-xs flex items-center space-x-2"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--vx-secondary)] shrink-0" />
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--vx-text-subtle)] italic bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] text-xs">
              No secondary differentials noted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
