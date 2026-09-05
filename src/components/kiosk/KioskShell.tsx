import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  CreditCard,
  ShieldCheck,
  Stethoscope,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Globe,
  AlertTriangle,
  X,
  HeartPulse,
  Sparkles,
  Building2,
} from 'lucide-react';
import { AbhaVerificationStep, VerifiedAbhaProfile } from './AbhaVerificationStep';
import { ConsentStep, ConsentPreferences } from './ConsentStep';
import { DepartmentSelectionStep } from './DepartmentSelectionStep';
import { InterviewEngine } from './InterviewEngine';
import { DocumentUploadStep } from './DocumentUploadStep';
import { StructuredPatientIntake, UploadedDocumentRecord } from '../../types';

export type KioskStep = 'abha' | 'consent' | 'department' | 'interview' | 'documents' | 'summary';

interface StepConfig {
  id: KioskStep;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'abha',
    stepNumber: 1,
    title: 'ABHA Identity Verification',
    subtitle: 'Enter your 14-digit ABHA ID or scan your Ayushman Bharat QR card',
    icon: CreditCard,
  },
  {
    id: 'consent',
    stepNumber: 2,
    title: 'Patient Informed Consent',
    subtitle: 'Review and approve digital health record processing for this consultation',
    icon: ShieldCheck,
  },
  {
    id: 'department',
    stepNumber: 3,
    title: 'Department & Clinical Mode',
    subtitle: 'Select consultation type: Modern Allopathic OPD or AIIA Ayurveda (AYUSH) OPD',
    icon: Building2,
  },
  {
    id: 'interview',
    stepNumber: 4,
    title: 'Adaptive Clinical Interview',
    subtitle: 'Interactive voice and touch-driven pre-consultation history collection',
    icon: Stethoscope,
  },
  {
    id: 'documents',
    stepNumber: 5,
    title: 'Document & Prescription Upload',
    subtitle: 'Scan previous physical prescriptions, lab tests, or discharge summaries',
    icon: UploadCloud,
  },
  {
    id: 'summary',
    stepNumber: 6,
    title: 'Intake Complete & Handoff',
    subtitle: 'Your intake briefing has been compiled and routed to the doctor',
    icon: CheckCircle2,
  },
];

export interface KioskShellProps {
  onExit: () => void;
  onSwitchToWorkstation?: () => void;
}

export const KioskShell: React.FC<KioskShellProps> = ({ onExit, onSwitchToWorkstation }) => {
  const { language, setLanguage } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [inactivitySeconds, setInactivitySeconds] = useState<number>(120);

  // Kiosk Session State
  const [verifiedProfile, setVerifiedProfile] = useState<VerifiedAbhaProfile | null>(null);
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [clinicalDepartment, setClinicalDepartment] = useState<'Allopathic' | 'Ayurveda (AYUSH)'>('Allopathic');
  const [structuredIntake, setStructuredIntake] = useState<StructuredPatientIntake | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocumentRecord[]>([]);

  const currentStep = STEPS[currentStepIndex];

  // Inactivity countdown simulation for patient privacy
  useEffect(() => {
    const timer = setInterval(() => {
      setInactivitySeconds((prev) => {
        if (prev <= 1) {
          // Reset to start on timeout
          handleReset();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => setInactivitySeconds(120);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setVerifiedProfile(null);
    setConsent(null);
    setClinicalDepartment('Allopathic');
    setStructuredIntake(null);
    setUploadedDocs([]);
    setCurrentStepIndex(0);
    setInactivitySeconds(120);
  };

  const StepIcon = currentStep.icon;

  return (
    <div
      id="kiosk-terminal-root"
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between select-none overflow-y-auto font-sans"
    >
      {/* KIOSK HEADER: Institutional Branding, Language, & Kiosk Step Progress */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-8 py-4 shrink-0 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">MediKiosk</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wide">
                  SIH 26047
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                All India Institute of Ayurveda & Ministry of AYUSH • OPD Intake
              </p>
            </div>
          </div>

          {/* Prominent Language Selector & Voice Guidance */}
          <div className="flex items-center gap-3">
            {/* Audio Guidance Toggle */}
            <button
              id="kiosk-audio-toggle"
              onClick={() => setAudioEnabled((prev) => !prev)}
              aria-label="Toggle Voice Guidance"
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
                audioEnabled
                  ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 hover:bg-teal-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title={audioEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
            >
              {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {/* Language Selector Buttons */}
            <div className="flex items-center p-1 bg-slate-800 rounded-2xl border border-slate-700">
              <button
                id="kiosk-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <button
                id="kiosk-lang-es"
                onClick={() => setLanguage('es')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
                  language === 'es'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Español</span>
              </button>
            </div>

            {/* Exit to Clinician Mode Button */}
            <button
              id="kiosk-exit-btn"
              onClick={() => setShowExitConfirm(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Staff Exit"
            >
              Exit Kiosk
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR: Large Icon-Driven Navigation */}
        <div className="max-w-6xl mx-auto mt-5 pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  id={`kiosk-step-${step.id}`}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer text-center sm:text-left ${
                    isActive
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-lg shadow-teal-950/40 ring-2 ring-teal-400/30'
                      : isPast
                      ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-400 hover:bg-slate-800'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm ${
                      isActive
                        ? 'bg-teal-400 text-slate-950'
                        : isPast
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="hidden lg:block overflow-hidden">
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      Step {step.stepNumber}
                    </div>
                    <div className="text-xs font-extrabold truncate">{step.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* KIOSK MAIN STAGE */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col justify-center items-center">
        {currentStep.id === 'abha' ? (
          <AbhaVerificationStep
            initialProfile={verifiedProfile}
            onVerified={(profile) => {
              setVerifiedProfile(profile);
              handleNext();
            }}
          />
        ) : currentStep.id === 'consent' ? (
          <ConsentStep
            initialConsent={consent || undefined}
            onConsentGiven={(prefs) => {
              setConsent(prefs);
              handleNext();
            }}
            onBack={handleBack}
          />
        ) : currentStep.id === 'department' ? (
          <DepartmentSelectionStep
            selectedDepartment={clinicalDepartment}
            onSelectDepartment={(dept) => {
              setClinicalDepartment(dept);
              handleNext();
            }}
            onBack={handleBack}
          />
        ) : currentStep.id === 'interview' ? (
          <InterviewEngine
            patientDemographics={{
              fullName: verifiedProfile?.fullName || 'Aarav Sharma',
              age: verifiedProfile?.age || 38,
              gender: verifiedProfile?.gender || 'Male',
              abhaId: verifiedProfile?.abhaId || '91-8765-4321-0987',
            }}
            clinicalDepartment={clinicalDepartment}
            initialIntake={structuredIntake}
            onComplete={(intake) => {
              setStructuredIntake(intake);
              handleNext();
            }}
            onBackToConsent={handleBack}
          />
        ) : currentStep.id === 'documents' ? (
          <DocumentUploadStep
            documents={uploadedDocs}
            onUpdateDocuments={(docs) => {
              setUploadedDocs(docs);
              if (structuredIntake) {
                setStructuredIntake({
                  ...structuredIntake,
                  uploadedDocuments: docs,
                });
              }
            }}
            onNext={handleNext}
            onBack={handleBack}
            patientContext={{
              name: verifiedProfile?.fullName || 'Aarav Sharma',
              age: verifiedProfile?.age || 38,
              gender: verifiedProfile?.gender || 'Male',
            }}
          />
        ) : (
          /* Step 6: Intake Complete & Handoff Summary */
          <div className="w-full max-w-3xl bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center flex flex-col items-center">
            {/* Step Icon Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-5 shadow-xl">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            {/* Step Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Intake Completed • Ready for Doctor Consultation
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Pre-Consultation Briefing Ready
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg mb-6 leading-relaxed">
              Your symptoms, history, and {uploadedDocs.length} uploaded document(s) have been compiled into a structured clinical profile for the attending physician.
            </p>

            {/* Summary Details Card */}
            <div className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 text-left mb-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-400 block">Patient Name:</span>
                  <strong className="text-white font-bold">{verifiedProfile?.fullName || 'Aarav Sharma'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">ABHA ID:</span>
                  <span className="text-teal-300 font-mono font-bold">{verifiedProfile?.abhaId || '91-8765-4321-0987'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department:</span>
                  <span className="text-amber-300 font-bold">{clinicalDepartment}</span>
                </div>
              </div>

              {/* Uploaded Documents Highlight */}
              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
                    <span>Uploaded Documents ({uploadedDocs.length}):</span>
                  </span>
                  <span className="text-slate-400">
                    {uploadedDocs.length === 0 ? 'None uploaded (Optional)' : 'Vision Extraction Verified'}
                  </span>
                </div>

                {uploadedDocs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {uploadedDocs.map((d) => {
                      const outOfRange = d.extractedData?.investigations?.filter((i) => i.isOutOfRange).length || 0;
                      return (
                        <div key={d.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <div className="font-bold text-slate-200 truncate">{d.fileName}</div>
                            <div className="text-[11px] text-slate-400">Date: {d.effectiveDate}</div>
                          </div>
                          {outOfRange > 0 && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 border border-orange-400/30 shrink-0">
                              {outOfRange} Abnormal
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-md flex flex-col gap-3">
              <button
                id="kiosk-finish-btn"
                onClick={handleReset}
                className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                <RotateCcw className="w-6 h-6" />
                <span>Finish & Start Next Patient</span>
              </button>

              {onSwitchToWorkstation && (
                <button
                  id="kiosk-workstation-handoff-btn"
                  onClick={onSwitchToWorkstation}
                  className="w-full h-14 rounded-2xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Open Doctor Consultation Queue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* KIOSK FOOTER: Privacy Inactivity Reset & Emergency Help */}
      <footer className="bg-slate-900/90 border-t border-slate-800 px-4 sm:px-8 py-3 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          {/* Inactivity Privacy Watchdog */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Public terminal active</span>
            <span className="text-slate-600">•</span>
            <span>Privacy reset in <strong className="text-teal-300">{inactivitySeconds}s</strong></span>
            <button
              onClick={() => setInactivitySeconds(120)}
              className="text-teal-400 underline hover:text-teal-300 ml-1 cursor-pointer"
            >
              Extend
            </button>
          </div>

          {/* Quick Reset & Staff Help */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Screen</span>
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">Need help? Ask hospital kiosk attendant</span>
          </div>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Exit Public Kiosk Terminal?</h3>
            <p className="text-slate-300 text-sm mb-6">
              This will close the self-service kiosk and return to the clinician workstation or landing page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Stay on Kiosk
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
