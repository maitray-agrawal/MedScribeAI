import React from 'react';
import { Objective, SectionDocumentationScore } from '../../types';
import { DocumentationConfidenceBadge } from './DocumentationConfidenceBadge';

interface ObjectiveSectionProps {
  objective: Objective;
  confidence?: SectionDocumentationScore;
  isEditing: boolean;
  onChange: (updatedObjective: Objective) => void;
}

export const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({
  objective,
  confidence,
  isEditing,
  onChange,
}) => {
  return (
    <div id="soap-section-objective" className="vx-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--vx-border)] pb-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-5 bg-[var(--vx-primary)] rounded-xs shrink-0"></span>
          <h3 className="font-serif font-semibold text-[var(--vx-text)] tracking-wide text-xs uppercase flex items-center space-x-2">
            <span>Objective (O)</span>
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <DocumentationConfidenceBadge sectionName="Objective (O)" confidence={confidence} />
          <span className="text-[10px] uppercase font-mono font-medium tracking-wider px-2 py-0.5 rounded-sm bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border border-[var(--vx-primary)]/20">
            Clinical Findings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Vital Signs:
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={objective.vital_signs}
              onChange={(e) =>
                onChange({
                  ...objective,
                  vital_signs: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2.5 text-[var(--vx-text)] text-xs font-mono font-semibold focus:border-[var(--vx-primary)] focus:outline-none"
            />
          ) : (
            <p className="text-[var(--vx-text)] font-mono font-semibold bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] leading-relaxed text-xs">
              {objective.vital_signs || 'Not documented'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Physical Examination:
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={objective.physical_exam}
              onChange={(e) =>
                onChange({
                  ...objective,
                  physical_exam: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2.5 text-[var(--vx-text)] text-xs focus:border-[var(--vx-primary)] focus:outline-none"
            />
          ) : (
            <p className="text-[var(--vx-text)] font-normal bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] leading-relaxed text-xs">
              {objective.physical_exam || 'Not performed/documented during this visit.'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Labs & Diagnostics Reviewed:
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={objective.labs_and_imaging}
              onChange={(e) =>
                onChange({
                  ...objective,
                  labs_and_imaging: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2.5 text-[var(--vx-text)] text-xs focus:border-[var(--vx-primary)] focus:outline-none"
            />
          ) : (
            <p className="text-[var(--vx-text)] font-normal bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] leading-relaxed text-xs">
              {objective.labs_and_imaging || 'None reviewed'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
