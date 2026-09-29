import React from 'react';
import { Subjective, SectionDocumentationScore } from '../../types';
import { DocumentationConfidenceBadge } from './DocumentationConfidenceBadge';
import { AstraBindu } from '../../design/components';

interface SubjectiveSectionProps {
  subjective: Subjective;
  confidence?: SectionDocumentationScore;
  isEditing: boolean;
  onChange: (updatedSubjective: Subjective) => void;
}

export const SubjectiveSection: React.FC<SubjectiveSectionProps> = ({
  subjective,
  confidence,
  isEditing,
  onChange,
}) => {
  return (
    <div id="soap-section-subjective" className="vx-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--vx-border)] pb-3">
        <div className="flex items-center gap-2.5">
          <AstraBindu size={12} color="var(--vx-primary)" />
          <h3 className="font-editorial text-sm sm:text-base font-semibold text-[var(--vx-text)] tracking-tight">
            <span>Subjective (S)</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <DocumentationConfidenceBadge sectionName="Subjective (S)" confidence={confidence} />
          <span className="vx-badge vx-badge-neutral">Patient Reported</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
            Chief Complaint (CC):
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={subjective.chief_complaint}
              onChange={(e) =>
                onChange({
                  ...subjective,
                  chief_complaint: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] p-2.5 text-[var(--vx-text)] text-xs font-medium focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)]"
            />
          ) : (
            <p className="text-[var(--vx-text)] font-semibold bg-[var(--vx-surface-secondary)] p-3 rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)] text-xs">
              {subjective.chief_complaint || 'Not documented'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
            Review of Systems (ROS):
          </label>
          {isEditing ? (
            <textarea
              rows={2}
              value={subjective.review_of_systems}
              onChange={(e) =>
                onChange({
                  ...subjective,
                  review_of_systems: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] p-2.5 text-[var(--vx-text)] text-xs font-medium focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)]"
            />
          ) : (
            <p className="text-[var(--vx-text)] bg-[var(--vx-surface-secondary)] p-3 rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)] text-xs">
              {subjective.review_of_systems || 'Not documented'}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
          History of Present Illness (HPI):
        </label>
        {isEditing ? (
          <textarea
            rows={3}
            value={subjective.history_of_present_illness}
            onChange={(e) =>
              onChange({
                ...subjective,
                history_of_present_illness: e.target.value,
              })
            }
            className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] p-2.5 text-[var(--vx-text)] text-xs font-normal focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] leading-relaxed"
          />
        ) : (
          <p className="text-[var(--vx-text)] bg-[var(--vx-surface-secondary)] p-3 rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)] text-xs leading-relaxed">
            {subjective.history_of_present_illness || 'Not documented'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <span className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
            Current Daily Medications:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {subjective.current_medications?.length > 0 ? (
              subjective.current_medications.map((med, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-[var(--vx-radius-xs)] font-mono text-[11px] bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] text-[var(--vx-text)]"
                >
                  {med}
                </span>
              ))
            ) : (
              <span className="text-[var(--vx-text-muted)] italic text-xs">None documented</span>
            )}
          </div>
        </div>

        <div>
          <span className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
            Known Drug Allergies:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {subjective.allergies?.length > 0 ? (
              subjective.allergies.map((alg, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-[var(--vx-radius-xs)] font-mono text-[11px] bg-[var(--vx-danger-soft)] border border-[var(--vx-border)] text-[var(--vx-danger)] font-semibold"
                >
                  {alg}
                </span>
              ))
            ) : (
              <span className="text-[var(--vx-text-muted)] italic text-xs">NKDA</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
