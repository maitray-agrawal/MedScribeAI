import React from 'react';
import { motion } from 'motion/react';
import { SafetyAlert, MetaInfo } from '../types';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, HelpCircle } from 'lucide-react';

interface SafetyAlertsPanelProps {
  safetyAlerts: SafetyAlert[];
  meta: MetaInfo;
}

export const SafetyAlertsPanel: React.FC<SafetyAlertsPanelProps> = ({ safetyAlerts, meta }) => {
  const hasHighSeverity = safetyAlerts?.some((a) => a.severity?.toLowerCase() === 'high');

  return (
    <div id="safety-alerts-container" className="space-y-4">
      {/* Meta Indicators Header Bar */}
      <div id="meta-indicators-bar" className="vx-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          {/* Time Saved Badge */}
          <div className="px-3 py-1.5 rounded-sm bg-[var(--vx-surface-muted)] border border-[var(--vx-border)] text-[var(--vx-text)] font-mono text-[11px] flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[var(--vx-primary)]" />
            <span className="font-semibold">~{meta?.time_saved_estimate_minutes || 12} mins</span>
            <span className="text-[var(--vx-text-muted)] font-normal">documentation time saved</span>
          </div>

          {/* Uncertainty Flag */}
          {meta?.uncertainty_flagged ? (
            <div className="px-3 py-1.5 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-mono text-[11px] flex items-center space-x-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold">Clinical Uncertainty Flagged</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-sm bg-[var(--vx-primary-soft)] border border-[var(--vx-primary)]/20 text-[var(--vx-primary)] font-mono text-[11px] flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" />
              <span className="font-semibold">Full Clinical Confidence</span>
            </div>
          )}
        </div>

        <div className="text-[var(--vx-text-muted)] font-mono text-[11px] flex items-center space-x-1.5 uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-[var(--vx-text-subtle)]" />
          <span>Sovereign Guardrails Active</span>
        </div>
      </div>

      {/* Safety Alerts Card */}
      <div
        id="safety-alerts-card"
        className={`vx-card p-5 overflow-hidden transition-all ${
          hasHighSeverity
            ? 'border-orange-500/40'
            : safetyAlerts?.length > 0
            ? 'border-amber-500/40'
            : 'border-[var(--vx-border)]'
        }`}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--vx-border)]">
          <div className="flex items-center space-x-3">
            <span
              className={`w-2 h-5 rounded-xs shrink-0 ${
                hasHighSeverity ? 'bg-orange-500 animate-pulse' : 'bg-[var(--vx-primary)]'
              }`}
            ></span>
            <div className="flex items-center space-x-2.5">
              <ShieldAlert
                className={`w-4 h-4 ${
                  hasHighSeverity ? 'text-orange-500' : 'text-[var(--vx-primary)]'
                }`}
              />
              <h3 className="font-serif font-semibold text-sm text-[var(--vx-text)] flex items-center space-x-2.5">
                <span>Clinical Safety & Interaction Alerts</span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs ${
                    safetyAlerts?.length > 0
                      ? hasHighSeverity
                        ? 'bg-orange-600 text-white'
                        : 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30'
                      : 'bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] border border-[var(--vx-primary)]/20'
                  }`}
                >
                  {safetyAlerts?.length || 0} Alerts
                </span>
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[var(--vx-text-muted)] uppercase tracking-wider hidden sm:inline">
            Requires Physician Verification
          </span>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          {safetyAlerts?.length > 0 ? (
            safetyAlerts.map((alert, idx) => {
              const severity = alert.severity?.toLowerCase();
              return (
                <motion.div
                  key={idx}
                  tabIndex={0}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className={`p-3.5 rounded-sm border flex items-start space-x-3 bg-[var(--vx-surface)] outline-none focus:ring-1 focus:ring-[var(--vx-primary)] cursor-pointer ${
                    severity === 'high'
                      ? 'border-orange-500/40 bg-orange-500/5 text-[var(--vx-text)]'
                      : severity === 'medium'
                      ? 'border-amber-500/40 bg-amber-500/5 text-[var(--vx-text)]'
                      : 'border-[var(--vx-border)] text-[var(--vx-text)]'
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      severity === 'high'
                        ? 'text-orange-500'
                        : severity === 'medium'
                        ? 'text-amber-500'
                        : 'text-[var(--vx-primary)]'
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-xs tracking-wider uppercase text-[var(--vx-text)]">
                        {alert.type || 'Safety Flag'}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded-xs ${
                          severity === 'high'
                            ? 'bg-orange-600 text-white'
                            : severity === 'medium'
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30'
                            : 'bg-[var(--vx-surface-muted)] text-[var(--vx-text-muted)] border border-[var(--vx-border)]'
                        }`}
                      >
                        {alert.severity} Severity
                      </span>
                    </div>
                    <p className="leading-relaxed text-[var(--vx-text)] font-normal text-xs">{alert.message}</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-3.5 rounded-sm bg-[var(--vx-primary-soft)] border border-[var(--vx-primary)]/20 text-[var(--vx-primary)] flex items-center space-x-2 font-medium text-xs">
              <CheckCircle2 className="w-4 h-4 text-[var(--vx-primary)] shrink-0" />
              <span>No drug interaction or documentation red flags detected in this encounter.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

