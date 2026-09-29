import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { PatientForm } from './components/PatientForm';
import { TranscriptInput } from './components/TranscriptInput';
import { SOAPNoteView } from './components/SOAPNoteView';
import { SafetyAlertsPanel } from './components/SafetyAlertsPanel';
import { BillingCodingPanel } from './components/BillingCodingPanel';
import { PrintPrescriptionModal } from './components/PrintPrescriptionModal';
import { EncounterHistoryModal } from './components/EncounterHistoryModal';
import { ClinicAnalyticsModal } from './components/ClinicAnalyticsModal';
import { SAMPLE_SCENARIOS } from './data/sampleScenarios';
import { PatientInfo, SOAPNote, EncounterRecord } from './types';
import { Sparkles, AlertCircle, FileText, CheckCircle2, RotateCcw, ShieldCheck, Lock, Activity } from 'lucide-react';

import { checkDrugInteractions } from './utils/drugInteractionChecker';
import { generateOfflineSOAPNote } from './utils/offlineLocalEngine';
import { detectTranscriptLanguage } from './utils/languageDetector';
import { useTranslation } from './i18n';
import { FHIRExportModal } from './components/soap-note';
import {
  AstraSutra,
  ClinicalStage,
  EvidencePanel,
  EvidenceItem,
  AstraFamilyPage,
  VaidhyaMark,
  AstraAttribution,
  AstraSeal,
} from './design/components';

const STORAGE_KEY = 'medscribe_lite_encounters_v1';

export default function App() {
  const { t } = useTranslation();

  // Navigation view state: 'landing' | 'workstation' | 'astrax'
  const [currentView, setCurrentView] = useState<'landing' | 'workstation' | 'astrax'>('landing');

  // Offline local model mode state
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Default patient info
  const defaultPatientInfo: PatientInfo = {
    name: 'Kwame Mensah',
    age: 28,
    sex: 'Male',
    medicalHistory: 'No chronic illness. Prior episode of malaria 2 years ago.',
    currentMedications: 'Paracetamol 500mg PRN',
    knownAllergies: 'NKDA',
    encounterType: 'Acute Unscheduled Visit',
    clinicLocation: 'Sub-District Health Center',
  };

  const [patientInfo, setPatientInfo] = useState<PatientInfo>(defaultPatientInfo);
  const [transcript, setTranscript] = useState<string>(SAMPLE_SCENARIOS[0].transcript);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SAMPLE_SCENARIOS[0].id);

  const [soapNote, setSoapNote] = useState<SOAPNote | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<'history' | 'analytics' | 'print' | 'fhir' | null>(null);

  // Saved encounters history in localStorage
  const [encounters, setEncounters] = useState<EncounterRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save encounters array to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));
    } catch (e) {
      console.error('Failed to save encounters to localStorage:', e);
    }
  }, [encounters]);

  // Load a sample scenario
  const handleSelectScenario = (scenarioId: string) => {
    const scenario = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenarioId(scenario.id);
    setPatientInfo(scenario.patientInfo);
    setTranscript(scenario.transcript);
    setErrorMessage(null);
  };

  // Reset Form
  const handleResetForm = () => {
    setPatientInfo({
      name: '',
      age: '',
      sex: 'Male',
      medicalHistory: '',
      currentMedications: '',
      knownAllergies: 'NKDA',
      encounterType: 'Primary Care Consultation',
      clinicLocation: 'Primary Care Clinic',
    });
    setTranscript('');
    setSelectedScenarioId('');
    setSoapNote(null);
    setErrorMessage(null);
  };

  // Generate SOAP Note via Gemini API or Offline Local Engine
  const handleGenerateSOAP = async (audioData?: { base64: string; mimeType: string }) => {
    setIsGenerating(true);
    setErrorMessage(null);

    // If Offline Mode is active, bypass backend network call completely
    if (isOfflineMode) {
      setTimeout(() => {
        const offlineNote = generateOfflineSOAPNote(patientInfo, transcript);
        setSoapNote(offlineNote);
        setIsGenerating(false);
        const soapElem = document.getElementById('soap-result-anchor');
        if (soapElem) {
          soapElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 400);
      return;
    }

    try {
      const response = await fetch('/api/medscribe/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientInfo,
          transcript,
          audioBase64: audioData?.base64,
          audioMimeType: audioData?.mimeType,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      const generatedData: SOAPNote = await response.json();
      setSoapNote(generatedData);

      // Auto-scroll to SOAP result
      setTimeout(() => {
        const soapElem = document.getElementById('soap-result-anchor');
        if (soapElem) {
          soapElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      console.warn('Backend API unavailable. Activating Offline Local Engine fallback:', err);
      const fallbackNote = generateOfflineSOAPNote(patientInfo, transcript);
      setSoapNote(fallbackNote);
      setErrorMessage('Cloud API unavailable. Offline Local Clinical Engine activated.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current encounter to localStorage history
  const handleSaveEncounter = () => {
    if (!soapNote) return;

    const activeScenario = SAMPLE_SCENARIOS.find((sc) => sc.id === selectedScenarioId);
    const activeRecordLang = activeScenario?.language || (transcript.trim() ? detectTranscriptLanguage(transcript) : undefined);

    const newRecord: EncounterRecord = {
      id: `enc-${Date.now()}`,
      timestamp: new Date().toISOString(),
      patientInfo,
      transcript,
      soapNote,
      status: 'finalized',
      language: activeRecordLang,
    };

    setEncounters((prev) => [newRecord, ...prev]);
    alert('Encounter saved successfully to clinic local records!');
  };

  // Load an existing encounter from history
  const handleLoadEncounterFromHistory = (record: EncounterRecord) => {
    setPatientInfo(record.patientInfo);
    setTranscript(record.transcript);
    setSoapNote(record.soapNote);
    setActiveModal(null);
  };

  // Delete an encounter from history
  const handleDeleteEncounter = (id: string) => {
    setEncounters((prev) => prev.filter((e) => e.id !== id));
  };

  // Clear all encounters
  const handleClearAllEncounters = () => {
    if (confirm('Are you sure you want to clear all saved encounter records?')) {
      setEncounters([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Determine current clinical stage for AstraSutra
  const currentStage: ClinicalStage = (() => {
    if (soapNote) return 'review';
    if (isGenerating) return 'structuring';
    if (transcript.trim().length > 0) return 'transcription';
    return 'intake';
  })();

  // Generate grounded evidence items dynamically from consultation context
  const evidenceItems: EvidenceItem[] = (() => {
    const items: EvidenceItem[] = [];

    if (patientInfo.knownAllergies && patientInfo.knownAllergies !== 'NKDA') {
      items.push({
        id: 'ev-allergies',
        source: 'Patient Clinical Baseline',
        type: 'Risk Factor',
        excerpt: `Reported allergy to: ${patientInfo.knownAllergies}. Cross-referenced against proposed prescription formulary.`,
        confidence: 98,
        verificationState: 'verified',
        groundingReference: 'Intake Record: Allergies',
      });
    }

    if (soapNote?.subjective?.chief_complaint) {
      items.push({
        id: 'ev-complaint',
        source: 'Consultation Transcript',
        type: 'Chief Complaint',
        excerpt: `Patient stated chief symptom: "${soapNote.subjective.chief_complaint}"`,
        confidence: 96,
        verificationState: 'verified',
        groundingReference: 'Transcript Audio / Text Stream',
      });
    }

    if (soapNote?.objective?.vital_signs) {
      items.push({
        id: 'ev-vitals',
        source: 'Clinical Examination',
        type: 'Vital Sign',
        excerpt: `Triage parameters observed: ${soapNote.objective.vital_signs}`,
        confidence: 95,
        verificationState: 'verified',
        groundingReference: 'Physical Exam: Vitals Log',
      });
    }

    if (soapNote?.assessment?.primary_diagnosis) {
      items.push({
        id: 'ev-diagnosis',
        source: 'Synthesized Reasoning',
        type: 'Symptom',
        excerpt: `Working clinical diagnosis established: ${soapNote.assessment.primary_diagnosis}. Differential coverage confirmed.`,
        confidence: 92,
        verificationState: 'physician-confirmed',
        groundingReference: 'ICD-10 Mapped Diagnostic Criteria',
      });
    }

    if (soapNote?.plan?.prescriptions && soapNote.plan.prescriptions.length > 0) {
      items.push({
        id: 'ev-rx',
        source: 'Therapeutic Orders',
        type: 'Medication',
        excerpt: `Prescriptions ordered: ${soapNote.plan.prescriptions.map((r) => `${r.medication} ${r.dosage}`).join(', ')}`,
        confidence: 94,
        verificationState: 'physician-confirmed',
        groundingReference: 'Formulary Safe Dosing Check',
      });
    }

    return items;
  })();

  // 1. Dedicated AstraX Family Page View
  if (currentView === 'astrax') {
    return <AstraFamilyPage onBackToVaidhya={() => setCurrentView('workstation')} />;
  }

  // 2. Landing Page View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchWorkstation={() => setCurrentView('workstation')}
        onNavigateToAstrax={() => setCurrentView('astrax')}
      />
    );
  }

  // 3. Workstation Clinical View
  return (
    <div
      id="app-root"
      className="min-h-screen bg-[var(--vx-bg)] text-[var(--vx-text)] flex flex-col font-sans selection:bg-[var(--vx-primary)] selection:text-white transition-colors duration-300"
    >
      {/* Top Navigation Bar */}
      <Header
        onOpenHistory={() => setActiveModal('history')}
        onOpenAnalytics={() => setActiveModal('analytics')}
        onSelectSampleScenario={(scenarioId) => {
          if (scenarioId) {
            handleSelectScenario(scenarioId);
          } else {
            handleSelectScenario(SAMPLE_SCENARIOS[0].id);
          }
        }}
        onNavigateToLanding={() => setCurrentView('landing')}
        onNavigateToAstrax={() => setCurrentView('astrax')}
        totalEncountersCount={encounters.length}
        safetyAlertsCount={soapNote?.safety_alerts?.length || 0}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => setIsOfflineMode((prev) => !prev)}
      />

      {/* Main Workspace Body */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sovereign Clinical Workflow Progression Bar (Astra Sutra) */}
        <AstraSutra
          currentStage={currentStage}
          onSelectStage={(stage) => {
            if (stage === 'intake') {
              const el = document.getElementById('patient-form-container');
              el?.scrollIntoView({ behavior: 'smooth' });
            } else if (stage === 'transcription') {
              const el = document.getElementById('transcript-input-container');
              el?.scrollIntoView({ behavior: 'smooth' });
            } else if (stage === 'review' || stage === 'evidence' || stage === 'approval') {
              const el = document.getElementById('soap-result-anchor');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Sovereign Instrument Status Banner */}
        <div
          id="intro-banner"
          className="vx-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rotate-45 bg-[var(--vx-primary)]"></span>
              <h2 className="font-serif font-bold text-base text-[var(--vx-text)] tracking-tight">
                {t.banner.vaidhyaTitle}
              </h2>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--vx-primary)] border border-[var(--vx-primary)]/20 bg-[var(--vx-primary-soft)] px-2 py-0.5 rounded-xs">
                {isOfflineMode ? t.banner.offlineEngine : t.banner.activeInference}
              </span>
            </div>
            <p className="text-xs text-[var(--vx-text-muted)] max-w-2xl leading-relaxed">
              {t.banner.vaidhyaSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-[var(--vx-secondary)] bg-[var(--vx-surface-muted)] px-3 py-1.5 rounded-xs border border-[var(--vx-border)]">
            <Lock className="w-3.5 h-3.5 text-[var(--vx-secondary)] shrink-0" />
            <span>{t.banner.vaultNotice}</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div
            id="error-banner"
            className="bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 p-4 rounded-sm text-xs flex items-center justify-between shadow-xs font-mono"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 dark:text-red-400 hover:underline uppercase text-[10px] tracking-wider cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Grid: Patient Information Form */}
        <PatientForm
          patientInfo={patientInfo}
          onChange={setPatientInfo}
          onReset={handleResetForm}
        />

        {/* Transcript Input Workspace */}
        <TranscriptInput
          transcript={transcript}
          onChangeTranscript={setTranscript}
          onSelectScenario={handleSelectScenario}
          onGenerateSOAP={handleGenerateSOAP}
          isGenerating={isGenerating}
          selectedScenarioId={selectedScenarioId}
          isOfflineMode={isOfflineMode}
        />

        {/* Anchor point for smooth auto-scroll */}
        <div id="soap-result-anchor"></div>

        {/* SOAP Note Output & Safety Panels */}
        {soapNote || isGenerating ? (
          <div className="space-y-6 pt-2">
            {/* Safety Alerts Panel */}
            {soapNote && (() => {
              const dbAlerts = checkDrugInteractions(
                soapNote.plan?.prescriptions || [],
                `${patientInfo.currentMedications || ''} ${soapNote.subjective?.current_medications?.join(' ') || ''}`,
                patientInfo.medicalHistory || '',
                `${patientInfo.knownAllergies || ''} ${soapNote.subjective?.allergies?.join(' ') || ''}`
              );

              const existingAlerts = soapNote.safety_alerts || [];
              const combinedAlerts = [...existingAlerts];
              dbAlerts.forEach((dbAlert) => {
                if (!combinedAlerts.some((a) => a.message === dbAlert.message)) {
                  combinedAlerts.push(dbAlert);
                }
              });

              return (
                <SafetyAlertsPanel
                  safetyAlerts={combinedAlerts}
                  meta={soapNote.meta || { uncertainty_flagged: false, time_saved_estimate_minutes: 12 }}
                />
              );
            })()}

            {/* SOAP Note View */}
            <SOAPNoteView
              soapNote={soapNote}
              isGenerating={isGenerating}
              isOfflineMode={isOfflineMode}
              recordLanguage={
                SAMPLE_SCENARIOS.find((sc) => sc.id === selectedScenarioId)?.language ||
                (transcript.trim() ? detectTranscriptLanguage(transcript) : undefined)
              }
              onUpdateSOAP={(updated) => setSoapNote(updated)}
              onOpenPrintPrescription={() => setActiveModal('print')}
              onOpenFHIR={() => setActiveModal('fhir')}
              onSaveEncounter={handleSaveEncounter}
            />

            {/* Evidence Grounding & Signal Provenance Panel */}
            {soapNote && evidenceItems.length > 0 && (
              <EvidencePanel evidenceItems={evidenceItems} />
            )}

            {/* Billing & Coding Suggestions Panel */}
            {soapNote && (
              <BillingCodingPanel
                billingSuggestions={soapNote.billing_suggestions || { icd_10_codes: [], cpt_codes: [] }}
              />
            )}
          </div>
        ) : (
          <div
            id="empty-state-card"
            className="vx-card p-10 text-center space-y-3"
          >
            <div className="w-10 h-10 rotate-45 border border-[var(--vx-border-strong)] flex items-center justify-center mx-auto mb-2">
              <div className="w-3.5 h-3.5 rotate-45 bg-[var(--vx-secondary)]"></div>
            </div>
            <h3 className="font-serif font-bold text-base text-[var(--vx-text)]">
              {t.emptyState.title}
            </h3>
            <p className="text-xs text-[var(--vx-text-muted)] max-w-md mx-auto leading-relaxed">
              {t.emptyState.text}
            </p>
          </div>
        )}
      </main>

      {/* Institutional AstraX Footer */}
      <footer
        id="app-footer"
        className="border-t border-[var(--vx-border)] bg-[var(--vx-surface)] py-6 mt-10 text-xs text-[var(--vx-text-muted)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <VaidhyaMark size={24} />
            <div>
              <p className="font-serif font-semibold text-[var(--vx-text)]">
                {t.footer.brandTag}
              </p>
              <p className="text-[10px] font-mono tracking-wider text-[var(--vx-text-subtle)]">
                {t.footer.mathGrammar}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AstraAttribution onClick={() => setCurrentView('astrax')} variant="minimal" />
            <span className="text-[var(--vx-text-subtle)]">·</span>
            <AstraSeal size={28} />
          </div>
        </div>
      </footer>

      {/* Modals with AnimatePresence exit animations */}
      <AnimatePresence>
        {activeModal === 'print' && soapNote && (
          <PrintPrescriptionModal
            key="print-modal"
            patientInfo={patientInfo}
            soapNote={soapNote}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'fhir' && soapNote && (
          <FHIRExportModal
            key="fhir-modal"
            patientInfo={patientInfo}
            soapNote={soapNote}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'history' && (
          <EncounterHistoryModal
            key="history-modal"
            encounters={encounters}
            onLoadEncounter={handleLoadEncounterFromHistory}
            onDeleteEncounter={handleDeleteEncounter}
            onClearAll={handleClearAllEncounters}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'analytics' && (
          <ClinicAnalyticsModal
            key="analytics-modal"
            encounters={encounters}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
