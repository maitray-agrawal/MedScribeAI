import React, { useState } from 'react';
import { PatientInfo } from '../types';
import { Activity, AlertCircle, Pill, ChevronDown, ChevronUp, RotateCcw, User, MapPin } from 'lucide-react';
import { useTranslation } from '../i18n';
import { AstraBindu } from '../design/components';

interface PatientFormProps {
  patientInfo: PatientInfo;
  onChange: (info: PatientInfo) => void;
  onReset: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patientInfo,
  onChange,
  onReset,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleInputChange = (field: keyof PatientInfo, value: any) => {
    onChange({
      ...patientInfo,
      [field]: value,
    });
  };

  return (
    <div id="patient-info-card" className="vx-card overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div
        id="patient-info-header"
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-[var(--vx-surface)] hover:bg-[var(--vx-surface-muted)] flex items-center justify-between cursor-pointer border-b border-[var(--vx-border)] transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <AstraBindu size={14} color="var(--vx-secondary)" />
          <h2 id="patient-info-title" className="font-editorial text-sm sm:text-base font-semibold text-[var(--vx-text)] tracking-tight">
            {t.patientForm.title}
          </h2>
          {patientInfo.name && (
            <span id="patient-summary-tag" className="vx-badge vx-badge-copper ml-1">
              {patientInfo.name} ({patientInfo.age ? `${patientInfo.age}y` : ''} {patientInfo.sex || ''})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-reset-patient"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="vx-btn-outline py-1 px-2.5 text-xs"
            title={t.patientForm.resetForm}
          >
            <RotateCcw className="w-3 h-3 text-[var(--vx-secondary)]" />
            <span>{t.patientForm.resetForm}</span>
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--vx-text-muted)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--vx-text-muted)]" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div id="patient-info-body" className="p-5 space-y-4 bg-[var(--vx-surface)] text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Patient Name */}
            <div>
              <label htmlFor="input-patient-name" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 uppercase text-[10px] tracking-wider">
                {t.patientForm.name} <span className="text-[var(--vx-danger)]">*</span>
              </label>
              <input
                id="input-patient-name"
                type="text"
                placeholder={t.patientForm.namePlaceholder}
                value={patientInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-medium focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all"
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="input-patient-age" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 uppercase text-[10px] tracking-wider">
                {t.patientForm.age} <span className="text-[var(--vx-danger)]">*</span>
              </label>
              <input
                id="input-patient-age"
                type="number"
                min="0"
                max="120"
                placeholder={t.patientForm.agePlaceholder}
                value={patientInfo.age}
                onChange={(e) => handleInputChange('age', e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-medium focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all"
              />
            </div>

            {/* Sex */}
            <div>
              <label htmlFor="select-patient-sex" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 uppercase text-[10px] tracking-wider">
                {t.patientForm.sex} <span className="text-[var(--vx-danger)]">*</span>
              </label>
              <select
                id="select-patient-sex"
                value={patientInfo.sex}
                onChange={(e) => handleInputChange('sex', e.target.value as any)}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-medium focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all cursor-pointer"
              >
                <option value="Male">{t.patientForm.sexMale}</option>
                <option value="Female">{t.patientForm.sexFemale}</option>
                <option value="Other">{t.patientForm.sexOther}</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="input-location" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 uppercase text-[10px] tracking-wider">
                {t.patientForm.location}
              </label>
              <input
                id="input-location"
                type="text"
                placeholder={t.patientForm.locationPlaceholder}
                value={patientInfo.clinicLocation || ''}
                onChange={(e) => handleInputChange('clinicLocation', e.target.value)}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-medium focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {/* Known Medical History */}
            <div>
              <label htmlFor="input-medical-history" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[var(--vx-primary)]" />
                <span>{t.patientForm.medicalHistory}</span>
              </label>
              <textarea
                id="input-medical-history"
                rows={2}
                placeholder={t.patientForm.medicalHistoryPlaceholder}
                value={patientInfo.medicalHistory || ''}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-normal focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all leading-relaxed"
              />
            </div>

            {/* Known Current Medications */}
            <div>
              <label htmlFor="input-current-medications" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3 h-3 text-[var(--vx-secondary)]" />
                <span>{t.patientForm.currentMedications}</span>
              </label>
              <textarea
                id="input-current-medications"
                rows={2}
                placeholder={t.patientForm.currentMedicationsPlaceholder}
                value={patientInfo.currentMedications || ''}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-normal focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all leading-relaxed"
              />
            </div>

            {/* Known Allergies */}
            <div>
              <label htmlFor="input-allergies" className="block text-[var(--vx-text-muted)] font-mono font-semibold mb-1 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-[var(--vx-danger)]" />
                <span>{t.patientForm.knownAllergies}</span>
              </label>
              <textarea
                id="input-allergies"
                rows={2}
                placeholder={t.patientForm.knownAllergiesPlaceholder}
                value={patientInfo.knownAllergies || ''}
                onChange={(e) => handleInputChange('knownAllergies', e.target.value)}
                className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] px-3 py-2 text-[var(--vx-text)] font-normal focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] text-xs transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
