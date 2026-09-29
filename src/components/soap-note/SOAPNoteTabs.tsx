import React from 'react';
import { useTranslation } from '../../i18n';

export type SOAPTabType = 'all' | 'subjective' | 'objective' | 'assessment' | 'plan';

interface SOAPNoteTabsProps {
  activeTab: SOAPTabType;
  onSelectTab: (tab: SOAPTabType) => void;
}

export const SOAPNoteTabs: React.FC<SOAPNoteTabsProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useTranslation();

  const tabs: { id: SOAPTabType; label: string }[] = [
    { id: 'all', label: t.soapView.tabAll },
    { id: 'subjective', label: t.soapView.tabSubjective },
    { id: 'objective', label: t.soapView.tabObjective },
    { id: 'assessment', label: t.soapView.tabAssessment },
    { id: 'plan', label: t.soapView.tabPlan },
  ];

  return (
    <div
      id="soap-tabs-bar"
      className="px-5 py-2.5 bg-[var(--vx-surface-secondary)] border-b border-[var(--vx-border)] flex items-center gap-1.5 text-xs overflow-x-auto select-none"
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-1.5 rounded-[var(--vx-radius-sm)] font-mono text-[11px] font-semibold cursor-pointer transition-all border whitespace-nowrap ${
              isSelected
                ? 'bg-[var(--vx-primary)] text-[var(--vx-primary-text)] border-[var(--vx-primary)] shadow-xs'
                : 'bg-[var(--vx-surface)] text-[var(--vx-text-secondary)] hover:bg-[var(--vx-surface-muted)] border-[var(--vx-border)]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
