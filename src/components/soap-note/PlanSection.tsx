import React from 'react';
import { Plan, Prescription, SectionDocumentationScore } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { DocumentationConfidenceBadge } from './DocumentationConfidenceBadge';

interface PlanSectionProps {
  plan: Plan;
  confidence?: SectionDocumentationScore;
  isEditing: boolean;
  onChange: (updatedPlan: Plan) => void;
  onPrescriptionChange: (index: number, field: keyof Prescription, value: string) => void;
  onAddPrescription: () => void;
  onRemovePrescription: (index: number) => void;
}

export const PlanSection: React.FC<PlanSectionProps> = ({
  plan,
  confidence,
  isEditing,
  onChange,
  onPrescriptionChange,
  onAddPrescription,
  onRemovePrescription,
}) => {
  return (
    <div id="soap-section-plan" className="vx-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--vx-border)] pb-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-5 bg-[var(--vx-primary)] rounded-xs shrink-0"></span>
          <h3 className="font-serif font-semibold text-[var(--vx-text)] tracking-wide text-xs uppercase flex items-center space-x-2">
            <span>Plan (P) & Treatment Prescriptions</span>
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <DocumentationConfidenceBadge sectionName="Plan (P)" confidence={confidence} />
          <span className="text-[10px] uppercase font-mono font-medium tracking-wider px-2 py-0.5 rounded-sm bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border border-[var(--vx-primary)]/20">
            Actionable Orders
          </span>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--vx-text)] font-semibold text-xs flex items-center space-x-2 font-mono uppercase tracking-wider">
            <span>Prescribed Medications</span>
            <span className="text-[var(--vx-text-subtle)] font-normal text-[11px]">
              ({plan.prescriptions?.length || 0})
            </span>
          </span>
          {isEditing && (
            <button
              onClick={onAddPrescription}
              className="text-xs text-[var(--vx-primary)] hover:text-white bg-[var(--vx-primary-soft)] hover:bg-[var(--vx-primary)] px-2.5 py-1 rounded-sm border border-[var(--vx-primary)]/30 flex items-center space-x-1 font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Drug</span>
            </button>
          )}
        </div>

        {plan.prescriptions?.length > 0 ? (
          <div className="overflow-x-auto rounded-sm border border-[var(--vx-border)]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] border-b border-[var(--vx-border)] font-mono font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-2.5">Medication</th>
                  <th className="p-2.5">Dosage</th>
                  <th className="p-2.5">Frequency</th>
                  <th className="p-2.5">Instructions</th>
                  {isEditing && <th className="p-2.5 w-10">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vx-border)] bg-[var(--vx-surface)]">
                {plan.prescriptions.map((rx, idx) => (
                  <tr key={idx} className="hover:bg-[var(--vx-surface-muted)] transition-colors">
                    <td className="p-2.5 font-semibold text-[var(--vx-primary)] font-mono">
                      {isEditing ? (
                        <input
                          type="text"
                          value={rx.medication}
                          onChange={(e) => onPrescriptionChange(idx, 'medication', e.target.value)}
                          className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-xs p-1 text-[var(--vx-text)] font-semibold"
                        />
                      ) : (
                        rx.medication
                      )}
                    </td>
                    <td className="p-2.5 text-[var(--vx-text)] font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={rx.dosage}
                          onChange={(e) => onPrescriptionChange(idx, 'dosage', e.target.value)}
                          className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-xs p-1 text-[var(--vx-text)]"
                        />
                      ) : (
                        rx.dosage
                      )}
                    </td>
                    <td className="p-2.5 text-[var(--vx-text-muted)] font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={rx.frequency}
                          onChange={(e) => onPrescriptionChange(idx, 'frequency', e.target.value)}
                          className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-xs p-1 text-[var(--vx-text)]"
                        />
                      ) : (
                        rx.frequency
                      )}
                    </td>
                    <td className="p-2.5 text-[var(--vx-text-subtle)] italic">
                      {isEditing ? (
                        <input
                          type="text"
                          value={rx.instructions}
                          onChange={(e) => onPrescriptionChange(idx, 'instructions', e.target.value)}
                          className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-xs p-1 text-[var(--vx-text)]"
                        />
                      ) : (
                        rx.instructions
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => onRemovePrescription(idx)}
                          className="text-[var(--vx-text-muted)] hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[var(--vx-text-subtle)] italic bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] text-xs">
            No prescriptions recorded for this encounter.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Diagnostic Tests Ordered:
          </label>
          <div className="bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] text-[var(--vx-text)] font-medium">
            {plan.diagnostic_tests_ordered?.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-xs">
                {plan.diagnostic_tests_ordered.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            ) : (
              <span className="text-[var(--vx-text-subtle)] italic text-xs">None ordered</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Patient Education & Lifestyle:
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={plan.patient_education}
              onChange={(e) =>
                onChange({
                  ...plan,
                  patient_education: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] text-xs focus:border-[var(--vx-primary)] focus:outline-none"
            />
          ) : (
            <p className="text-[var(--vx-text)] bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] leading-relaxed font-normal text-xs">
              {plan.patient_education || 'Standard health education provided.'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[var(--vx-text-muted)] text-[10px] font-mono uppercase tracking-wider mb-1">
            Follow-up & Safety Netting:
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={plan.follow_up}
              onChange={(e) =>
                onChange({
                  ...plan,
                  follow_up: e.target.value,
                })
              }
              className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] text-xs focus:border-[var(--vx-primary)] focus:outline-none"
            />
          ) : (
            <p className="text-[var(--vx-primary)] bg-[var(--vx-surface-muted)] p-3 rounded-sm border border-[var(--vx-border)] leading-relaxed font-semibold text-xs">
              {plan.follow_up || 'Return as needed if symptoms worsen.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
