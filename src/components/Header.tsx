import React from 'react';
import { Stethoscope, History, BarChart3, Wifi, WifiOff, Sparkles, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenAnalytics: () => void;
  onSelectSampleScenario: () => void;
  onNavigateToLanding?: () => void;
  totalEncountersCount: number;
  safetyAlertsCount: number;
  isOfflineMode?: boolean;
  onToggleOfflineMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenAnalytics,
  onSelectSampleScenario,
  onNavigateToLanding,
  totalEncountersCount,
  isOfflineMode = false,
  onToggleOfflineMode,
}) => {
  return (
    <header id="header-container" className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div id="header-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Branding */}
        <div id="branding-section" className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateToLanding}>
          <div id="brand-logo" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold">
            <Stethoscope className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 id="app-title" className="font-bold text-lg text-slate-800 tracking-tight">MedScribe <span className="text-blue-600 font-extrabold">Lite</span></h1>
              <span id="badge-primary-care" className="badge-brand">
                Safety Copilot
              </span>
            </div>
            <p id="app-subtitle" className="text-xs text-slate-500 font-medium hidden sm:block">Primary Care Clinical Safety Copilot & Scribe</p>
          </div>
        </div>

        {/* Center - Status Indicators & Offline Toggle */}
        <div id="status-section" className="hidden md:flex items-center space-x-3 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <button
            id="btn-toggle-offline-mode"
            onClick={onToggleOfflineMode}
            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
              isOfflineMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
            title={isOfflineMode ? 'Switch to Cloud Gemini 3.6 Flash API' : 'Switch to Local Browser-Only Engine'}
          >
            {isOfflineMode ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                <span>Offline Engine Active</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cloud Gemini API</span>
              </>
            )}
          </button>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Safety Guardrails Active</span>
          </div>
        </div>

        {/* Action Controls */}
        <div id="header-actions" className="flex items-center space-x-2 sm:space-x-3">
          {onNavigateToLanding && (
            <button
              id="btn-goto-landing"
              onClick={onNavigateToLanding}
              className="btn-outline text-slate-700 border-slate-300 py-1.5 px-3 text-xs"
              title="Return to Marketing Landing Page"
            >
              <span className="hidden sm:inline">Product Info</span>
              <span className="sm:hidden">Info</span>
            </button>
          )}

          <button
            id="btn-sample-scenarios"
            onClick={onSelectSampleScenario}
            className="btn-outline text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
            title="Load Pre-populated Clinical Cases"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Load Sample Case</span>
          </button>

          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className="btn-secondary py-1.5 px-3.5"
            title="View Encounters History"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Encounters</span>
            {totalEncountersCount > 0 && (
              <span className="bg-blue-600 text-white font-bold px-1.5 py-0.2 text-[11px] rounded-full">
                {totalEncountersCount}
              </span>
            )}
          </button>

          <button
            id="btn-open-analytics"
            onClick={onOpenAnalytics}
            className="btn-primary py-2 px-3.5 shadow-xs"
            title="Clinic Productivity Metrics"
          >
            <BarChart3 className="w-4 h-4 text-white" />
            <span className="hidden md:inline">Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
